import { Component, inject, signal, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SessionService } from '../../services/session.service';
import { AuthService } from '../../services/auth.service';
import { NextQuestionDto, SessionStatusResponse } from '../../models/models';

type Phase = 'start' | 'running' | 'emergency' | 'finished' | 'error';

@Component({
  selector: 'app-symptom-checker',
  imports: [],
  templateUrl: './symptom-checker.html',
  styleUrl: './symptom-checker.css',
})
export class SymptomChecker implements OnInit {
  private session = inject(SessionService);
  private auth = inject(AuthService);
  private router = inject(Router);

  phase = signal<Phase>('start');
  sessionId = signal<number | null>(null);
  question = signal<NextQuestionDto | null>(null);
  result = signal<SessionStatusResponse | null>(null);
  answeredCount = signal(0);
  loading = signal(false);
  errorMsg = signal('');
  exporting = signal(false);

  ngOnInit() {
    if (!this.auth.isLoggedIn()) {
      this.router.navigate(['/login']);
    }
  }

  startSession() {
    this.loading.set(true);
    this.errorMsg.set('');
    this.session.start().subscribe({
      next: (res) => {
        this.sessionId.set(res.sessionId);
        this.question.set(res.question ?? null);
        this.phase.set('running');
        this.loading.set(false);
      },
      error: () => {
        this.errorMsg.set('Session konnte nicht gestartet werden. Bitte erneut versuchen.');
        this.loading.set(false);
      }
    });
  }

  answer(value: boolean) {
    const sid = this.sessionId();
    const q = this.question();
    if (sid === null || q === null || this.loading()) return;

    this.loading.set(true);
    this.session.answer(sid, q.questionId, value).subscribe({
      next: (res) => {
        this.answeredCount.update(n => n + 1);
        this.loading.set(false);

        if (res.isEmergency) {
          this.phase.set('emergency');
          return;
        }
        if (res.sessionFinished || !res.nextQuestion) {
          this.loadResult(sid);
          return;
        }
        this.question.set(res.nextQuestion);
      },
      error: () => {
        this.errorMsg.set('Fehler beim Speichern der Antwort.');
        this.loading.set(false);
      }
    });
  }

  private loadResult(sid: number) {
    this.session.finish(sid).subscribe({
      next: () => {
        this.session.getStatus(sid).subscribe({
          next: (status) => {
            this.result.set(status);
            this.phase.set('finished');
          },
          error: () => {
            this.phase.set('error');
          }
        });
      },
      error: () => {
        // finish might already be done — try getStatus anyway
        this.session.getStatus(sid).subscribe({
          next: (status) => {
            this.result.set(status);
            this.phase.set('finished');
          },
          error: () => this.phase.set('error')
        });
      }
    });
  }

  exportPdf() {
    const sid = this.sessionId();
    if (!sid) return;
    this.exporting.set(true);
    this.session.exportPdf(sid).subscribe({
      next: (blob) => {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `checkuin-bericht-${sid}.pdf`;
        a.click();
        URL.revokeObjectURL(url);
        this.exporting.set(false);
      },
      error: () => this.exporting.set(false)
    });
  }

  restart() {
    this.phase.set('start');
    this.sessionId.set(null);
    this.question.set(null);
    this.result.set(null);
    this.answeredCount.set(0);
    this.errorMsg.set('');
  }

  percent(p: number): string {
    return (p * 100).toFixed(0) + '%';
  }
}
