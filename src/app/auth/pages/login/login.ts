import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms'; 
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css']

})
export class Login {

  // Modelo de datos para el Two-Way Binding
  loginData = {
    email: '',
    password: ''
  };

  constructor() { }

  /**
   * Maneja el envío del Template-driven Form (formulario basado en plantillas).
   * La validación y el estado se gestionan implícitamente por NgForm.
   * @param form La referencia al formulario (NgForm).
   */
  iniciarSesion(form: NgForm): void {
    
    if (form.valid) {
      // Los datos listos para ser enviados a tu backend (Spring Boot).
      // Aquí harás la llamada a tu servicio (ej. HttpClient) para enviar 'this.loginData'.
      console.log('Datos listos para enviar al backend (Spring Boot):', this.loginData);
    } else {
      console.warn('Formulario inválido. Por favor, revisa los campos requeridos.');
    }
  }

}