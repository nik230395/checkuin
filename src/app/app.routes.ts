import { Routes } from '@angular/router';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { Auth } from './pages/auth/auth';
import { Home } from './pages/home/home';
import { Lexikon } from './pages/lexikon/lexikon';
import { Team } from './pages/team/team';
import { SymptomChecker } from './pages/symptom-checker/symptom-checker';
import { Login } from './pages/login/login';
import { AuthService } from './services/auth.service';

const authGuard = () => {
  const auth = inject(AuthService);
  const router = inject(Router);
  if (auth.isLoggedIn()) return true;
  return router.createUrlTree(['/login']);
};

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'home', component: Home },
  { path: 'login', component: Login },
  { path: 'auth', redirectTo: 'login', pathMatch: 'full' },
  { path: 'lexikon', component: Lexikon },
  { path: 'team', component: Team },
  { path: 'symptom-Checker', component: SymptomChecker, canActivate: [authGuard] },
  { path: '**', redirectTo: '' }
];
