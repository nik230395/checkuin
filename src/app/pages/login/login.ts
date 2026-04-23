import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  isLoginMode = true; 

  toggleMode() {
    this.isLoginMode = !this.isLoginMode;
  }

  onSubmit(form: any) {
    console.log('Formular gesendet:', form.value);
  }
}
