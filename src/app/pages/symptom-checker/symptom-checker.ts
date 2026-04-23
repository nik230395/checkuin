import { Component, inject, signal, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SessionService } from '../../services/session.service';
import { AuthService } from '../../services/auth.service';
import { DiagnosisResultDto, NextQuestionDto } from '../../models/models';

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
  results = signal<DiagnosisResultDto[]>([]);
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
        // Check if very first question is already an emergency (edge case)
        if (res.question?.isEmergency) {
          this.phase.set('emergency');
        } else {
          this.phase.set('running');
        }
        this.loading.set(false);
      },
      error: (err) => {
        this.errorMsg.set(
          err.status === 401
            ? 'Sitzung abgelaufen. Bitte erneut anmelden.'
            : 'Session konnte nicht gestartet werden. Bitte erneut versuchen.'
        );
        this.loading.set(false);
      }
    });
  }

  answer(value: boolean) {
    const sid = this.sessionId();
    const q = this.question();
    if (sid === null || q === null || this.loading()) return;

    this.loading.set(true);
    this.errorMsg.set('');

    // Backend AnswerRequest expects { questionId, answer }
    // NextQuestionDto.symptomId is what the backend calls questionId in AnswerRequest
    this.session.answer(sid, q.symptomId, value).subscribe({
      next: (res) => {
        this.answeredCount.update(n => n + 1);
        this.loading.set(false);

        if (res.finished) {
          // Results are directly in AnswerResultDto.top3Results — no extra call needed
          this.results.set(res.top3Results ?? []);
          this.phase.set('finished');
          return;
        }

        if (!res.nextQuestion) {
          this.phase.set('error');
          return;
        }

        if (res.nextQuestion.isEmergency) {
          this.phase.set('emergency');
          return;
        }

        this.question.set(res.nextQuestion);
      },
      error: (err) => {
        this.loading.set(false);
        this.errorMsg.set(
          err.status === 400
            ? 'Ungültige Antwort. Bitte erneut versuchen.'
            : 'Fehler beim Speichern der Antwort.'
        );
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
    this.results.set([]);
    this.answeredCount.set(0);
    this.errorMsg.set('');
  }

  dangerLabel(level: number): string {
    if (level >= 3) return 'Hoch';
    if (level === 2) return 'Mittel';
    return 'Niedrig';
  }

  dangerClass(level: number): string {
    if (level >= 3) return 'danger-high';
    if (level === 2) return 'danger-medium';
    return 'danger-low';
  }

  percent(p: number): string {
    return (p * 100).toFixed(0) + '%';
  }
}
