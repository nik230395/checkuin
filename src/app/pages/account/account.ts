import { Component, inject, signal, OnInit } from '@angular/core';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';
import { SessionService } from '../../services/session.service';
import { SessionStatusResponse, UserProfile } from '../../models/models';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-account',
  imports: [RouterModule, DatePipe],
  templateUrl: './account.html',
  styleUrl: './account.css',
})
export class Account implements OnInit {
  private auth    = inject(AuthService);
  private session = inject(SessionService);
  private router  = inject(Router);
  private route   = inject(ActivatedRoute);
  private http    = inject(HttpClient);

  profile      = signal<UserProfile | null>(null);
  sessions     = signal<SessionStatusResponse[]>([]);
  loading      = signal(true);
  resuming     = signal<number | null>(null);
  deleting     = signal(false);
  successMsg   = signal('');
  errorMsg     = signal('');
  showDeleteConfirm = signal(false);
  exportingId  = signal<number | null>(null);

  // Passwort ändern
  showPasswordForm = signal(false);
  pwLoading        = signal(false);
  pwSuccess        = signal('');
  pwError          = signal('');
  showCur          = false;
  showNew          = false;
  showConfirm      = false;

  ngOnInit() {
    if (!this.auth.isLoggedIn()) {
      this.router.navigate(['/login']);
      return;
    }

    this.route.queryParams.subscribe(p => {
      if (p['paused'] === '1') {
        this.successMsg.set('Session pausiert – du kannst sie hier jederzeit fortsetzen.');
      }
    });

    this.loadData();
  }

  private loadData() {
    this.loading.set(true);
    this.session.getMe().subscribe({
      next: (p) => this.profile.set(p),
      error: () => {}
    });

    this.session.getHistory().subscribe({
      next: (s) => {
        // Neueste zuerst
        this.sessions.set([...s].sort((a, b) =>
          new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime()
        ));
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  resumeSession(s: SessionStatusResponse) {
    this.resuming.set(s.sessionId);
    this.errorMsg.set('');
    this.session.resume(s.sessionId).subscribe({
      next: (res) => {
        this.resuming.set(null);
        this.router.navigate(['/symptom-Checker'], {
          state: {
            resumeSession: {
              sessionId: res.sessionId,
              question:  res.question
            }
          }
        });
      },
      error: (err) => {
        this.resuming.set(null);
        const msg = err.error?.error ?? '';
        if (msg.includes('abgelaufen') || msg.includes('>48h')) {
          this.errorMsg.set('Session ist abgelaufen (>48h). Bitte starte einen neuen Check.');
        } else {
          this.errorMsg.set('Session konnte nicht fortgesetzt werden.');
        }
        this.loadData(); // Refresh status
      }
    });
  }

  exportPdf(sessionId: number) {
    this.exportingId.set(sessionId);
    this.session.exportPdf(sessionId).subscribe({
      next: (blob) => {
        const url = URL.createObjectURL(blob);
        const a   = document.createElement('a');
        a.href     = url;
        a.download  = `checkuin-bericht-${sessionId}.pdf`;
        a.click();
        URL.revokeObjectURL(url);
        this.exportingId.set(null);
      },
      error: () => {
        this.exportingId.set(null);
        this.errorMsg.set('PDF konnte nicht erstellt werden.');
      }
    });
  }

  confirmDelete() {
    this.showDeleteConfirm.set(true);
  }

  cancelDelete() {
    this.showDeleteConfirm.set(false);
  }

  deleteAccount() {
    this.deleting.set(true);
    this.session.deleteAccount().subscribe({
      next: () => {
        this.auth.logout(); // clears localStorage + navigates to /
      },
      error: () => {
        this.deleting.set(false);
        this.errorMsg.set('Account konnte nicht gelöscht werden. Bitte erneut versuchen.');
        this.showDeleteConfirm.set(false);
      }
    });
  }

  changePassword(currentPw: string, newPw: string, confirmPw: string) {
    this.pwError.set('');
    this.pwSuccess.set('');
    if (!currentPw || !newPw || !confirmPw) {
      this.pwError.set('Bitte alle Felder ausfüllen.');
      return;
    }
    if (newPw.length < 8) {
      this.pwError.set('Neues Passwort muss mindestens 8 Zeichen lang sein.');
      return;
    }
    if (newPw !== confirmPw) {
      this.pwError.set('Neues Passwort und Bestätigung stimmen nicht überein.');
      return;
    }
    this.pwLoading.set(true);
    this.http.put<{message?: string; error?: string}>(
      `${environment.apiUrl}/user/me/password`,
      { currentPassword: currentPw, newPassword: newPw }
    ).subscribe({
      next: () => {
        this.pwLoading.set(false);
        this.pwSuccess.set('Passwort erfolgreich geändert.');
        this.showPasswordForm.set(false);
      },
      error: (err) => {
        this.pwLoading.set(false);
        this.pwError.set(err.error?.error ?? 'Passwort konnte nicht geändert werden.');
      }
    });
  }

  logout() {
    this.auth.logout();
  }

  statusLabel(status: string): string {
    switch (status) {
      case 'AKTIV':       return 'Aktiv';
      case 'PAUSIERT':    return 'Pausiert';
      case 'ABGESCHLOSSEN': return 'Abgeschlossen';
      default:            return status;
    }
  }

  statusClass(status: string): string {
    switch (status) {
      case 'AKTIV':       return 'status-active';
      case 'PAUSIERT':    return 'status-paused';
      case 'ABGESCHLOSSEN': return 'status-done';
      default:            return '';
    }
  }

  dangerLabel(level: number): string {
    if (level >= 3) return 'Hohes Risiko';
    if (level === 2) return 'Mittleres Risiko';
    return 'Niedriges Risiko';
  }

  percent(p: number): string {
    return (p * 100).toFixed(0) + '%';
  }
}
