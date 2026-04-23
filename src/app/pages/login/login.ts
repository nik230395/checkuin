import { Component, inject, signal } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  imports: [RouterModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  private auth = inject(AuthService);
  private router = inject(Router);

  isLoginMode = signal(true);
  loading = signal(false);
  error = signal('');
  successMsg = signal('');

  toggleMode() {
    this.isLoginMode.update(v => !v);
    this.error.set('');
    this.successMsg.set('');
  }

  onSubmit(email: string, password: string, name?: string) {
    this.error.set('');
    this.successMsg.set('');

    if (!email || !password) {
      this.error.set('Bitte alle Felder ausfüllen.');
      return;
    }

    this.loading.set(true);

    if (this.isLoginMode()) {
      this.auth.login({ usernameOrEmail: email, password }).subscribe({
        next: () => {
          this.loading.set(false);
          this.router.navigate(['/symptom-Checker']);
        },
        error: (err) => {
          this.loading.set(false);
          this.error.set(err.status === 401 ? 'Falsche E-Mail oder Passwort.' : 'Anmeldung fehlgeschlagen.');
        }
      });
    } else {
      if (!name) {
        this.error.set('Bitte Namen eingeben.');
        this.loading.set(false);
        return;
      }
      const username = name.trim().toLowerCase().replace(/\s+/g, '_');
      this.auth.register({ username, email, password }).subscribe({
        next: () => {
          this.loading.set(false);
          this.successMsg.set('Registrierung erfolgreich! Bitte E-Mail bestätigen.');
          this.isLoginMode.set(true);
        },
        error: (err) => {
          this.loading.set(false);
          this.error.set(err.status === 409 ? 'E-Mail bereits registriert.' : 'Registrierung fehlgeschlagen.');
        }
      });
    }
  }
}
