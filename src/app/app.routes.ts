import { Routes } from '@angular/router';
import { Auth} from './pages/auth/auth'; 
import { Home} from './pages/home/home';
import { Lexikon} from './pages/lexikon/lexikon';
import { Team } from './pages/team/team';
import { SymptomChecker } from './pages/symptom-checker/symptom-checker';
import { Login } from './pages/login/login';

export const routes: Routes = [
  { path: '', component: Home},
  { path: 'auth', component: Auth}, 
  { path: 'lexikon', component: Lexikon },
  { path:'team', component: Team},
  {path: 'home', component:Home},
  {path:'symptom-Checker', component:SymptomChecker},
  {path:'login', component:Login}
];