import { Component, inject, signal, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-reset-password',
  imports: [],
  templateUrl: './reset-password.html',
  styleUrl: './reset-password.css'
})
export class ResetPassword implements OnInit {
  private router  = inject(Router);
  private route   = inject(ActivatedRoute);
  private http    = inject(HttpClient);

  token     = signal('');
  loading   = signal(false);
  error     = signal('');
  success   = signal(false);

  ngOnInit() {
    this.route.queryParams.subscribe(p => {
      this.token.set(p['token'] ?? '');
      if (!this.token()) this.error.set('Ungültiger Reset-Link. Bitte einen neuen anfordern.');
    });
  }

  submit(pw: string, pw2: string) {
    this.error.set('');
    if (!pw || pw.length < 8) {
      this.error.set('Passwort muss mindestens 8 Zeichen lang sein.'); return;
    }
    if (pw !== pw2) {
      this.error.set('Passwörter stimmen nicht überein.'); return;
    }
    this.loading.set(true);
    this.http.post(`${environment.apiUrl}/auth/reset-password`,
      { token: this.token(), newPassword: pw }
    ).subscribe({
      next: () => {
        this.loading.set(false);
        this.success.set(true);
        setTimeout(() => this.router.navigate(['/login'], { queryParams: { passwordReset: 'true' } }), 2500);
      },
      error: (err) => {
        this.loading.set(false);
        this.error.set(err.error?.error ?? 'Fehler. Bitte erneut versuchen.');
      }
    });
  }
}
