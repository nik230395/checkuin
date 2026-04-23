// src/app/pages/auth/auth.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './auth.html', // Prüfe ob der Name stimmt!
  styleUrl: './auth.css'
})
export class Auth{ // Muss AuthComponent heißen, nicht nur Auth
  mode: 'login' | 'register' | 'verify' = 'login'; // Das MUSS hier stehen

  setMode(newMode: 'login' | 'register' | 'verify') {
    this.mode = newMode;
  }

  handleFormSubmit(event: Event) {
    event.preventDefault();
  }
}