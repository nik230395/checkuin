import { Component, inject, signal, OnInit } from '@angular/core';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-login',
  imports: [RouterModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login implements OnInit {
  private auth = inject(AuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private http = inject(HttpClient);

  isLoginMode = signal(true);
  loading = signal(false);
  error = signal('');
  successMsg = signal('');
  // for "resend verification" flow
  unverifiedUsername = signal('');

  ngOnInit() {
    // Handle redirect from email verification link
    this.route.queryParams.subscribe(params => {
      if (params['verified'] === 'true') {
        this.successMsg.set('✓ E-Mail erfolgreich bestätigt! Du kannst dich jetzt anmelden.');
      }
      if (params['verifyError'] === 'true') {
        this.error.set('Verifizierungs-Link ungültig oder abgelaufen. Bitte erneut anfordern.');
      }
    });
  }

  onSubmit(emailOrUsername: string, password: string, name?: string) {
    this.error.set('');
    this.successMsg.set('');
    this.unverifiedUsername.set('');

    if (!emailOrUsername || !password) {
      this.error.set('Bitte alle Felder ausfüllen.');
      return;
    }

    this.loading.set(true);

    if (this.isLoginMode()) {
      // Backend field is "username" but it accepts email OR username
      this.auth.login({ username: emailOrUsername, password }).subscribe({
        next: () => {
          this.loading.set(false);
          this.router.navigate(['/symptom-Checker']);
        },
        error: (err) => {
          this.loading.set(false);
          if (err.status === 409) {
            // Email not verified yet
            this.error.set('E-Mail noch nicht bestätigt. Bitte überprüfe dein Postfach.');
            // Save the identifier so we can offer resend
            this.unverifiedUsername.set(emailOrUsername);
          } else if (err.status === 400 || err.status === 401) {
            this.error.set('Falsche E-Mail/Benutzername oder Passwort.');
          } else {
            this.error.set('Anmeldung fehlgeschlagen. Bitte erneut versuchen.');
          }
        }
      });
    } else {
      // Registration
      if (!name?.trim()) {
        this.error.set('Bitte Namen eingeben.');
        this.loading.set(false);
        return;
      }
      if (password.length < 8) {
        this.error.set('Passwort muss mindestens 8 Zeichen lang sein.');
        this.loading.set(false);
        return;
      }
      const username = name.trim().toLowerCase().replace(/\s+/g, '_');
      this.auth.register({ username, email: emailOrUsername, password }).subscribe({
        next: () => {
          this.loading.set(false);
          this.successMsg.set('Registrierung erfolgreich! Bitte bestätige deine E-Mail-Adresse.');
          this.isLoginMode.set(true);
        },
        error: (err) => {
          this.loading.set(false);
          if (err.status === 409 || err.status === 400) {
            const msg: string = err.error?.error ?? '';
            if (msg.toLowerCase().includes('email')) {
              this.error.set('Diese E-Mail-Adresse ist bereits registriert.');
            } else if (msg.toLowerCase().includes('username') || msg.toLowerCase().includes('benutzer')) {
              this.error.set('Dieser Benutzername ist bereits vergeben.');
            } else {
              this.error.set('Registrierung fehlgeschlagen. E-Mail oder Benutzername bereits vorhanden.');
            }
          } else {
            this.error.set('Registrierung fehlgeschlagen. Bitte erneut versuchen.');
          }
        }
      });
    }
  }

  resendVerification() {
    const identifier = this.unverifiedUsername();
    if (!identifier) return;
    this.loading.set(true);
    this.http.post(`${environment.apiUrl}/auth/resend-verification`, null, {
      params: { username: identifier }
    }).subscribe({
      next: () => {
        this.loading.set(false);
        this.successMsg.set('Neue Bestätigungs-E-Mail wurde gesendet!');
        this.unverifiedUsername.set('');
        this.error.set('');
      },
      error: () => {
        this.loading.set(false);
        this.error.set('E-Mail konnte nicht gesendet werden. Bitte Benutzernamen verwenden.');
      }
    });
  }
}
