import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-contrasena',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './contrasena.html',
  styleUrl: './contrasena.scss',
})
export class Contrasena implements OnInit {
  private http = inject(HttpClient);
  private router = inject(Router);

  public nuevaContrasena: string = '';
  public confirmarContrasena: string = '';
  public successMessage: string | null = null;
  public errorMessage: string | null = null;
  public isLoading: boolean = false;

  private readonly API_URL = 'http://localhost:8080/api/cliente/cambiar-clave';

  ngOnInit(): void {
    console.log('[CAMBIO CONTRASEÑA ESTUDIANTE] Componente inicializado');
  }

  cambiarContrasena(form: NgForm): void {
    this.successMessage = null;
    this.errorMessage = null;

    if (form.invalid) {
      this.errorMessage = 'Por favor, completa todos los campos.';
      return;
    }

    if (this.nuevaContrasena !== this.confirmarContrasena) {
      this.errorMessage = 'Las contraseñas no coinciden.';
      return;
    }

    if (this.nuevaContrasena.length < 6) {
      this.errorMessage = 'La contraseña debe tener al menos 6 caracteres.';
      return;
    }

    this.isLoading = true;
    console.log('[CAMBIO CONTRASEÑA ESTUDIANTE] Enviando solicitud de cambio');

    const payload = {
      nuevaContrasena: this.nuevaContrasena,
      confirmarContrasena: this.confirmarContrasena
    };

    // 🔑 CAMBIO CLAVE AQUÍ: Se espera una respuesta de tipo 'text'
    this.http.post(this.API_URL, payload, { responseType: 'text' as 'json' }).subscribe({
      next: () => {
        console.log('[CAMBIO CONTRASEÑA ESTUDIANTE] Contraseña cambiada exitosamente');
        this.successMessage = '¡Contraseña cambiada exitosamente! Serás redirigido al login...';
        this.isLoading = false;

        // Resetear formulario
        form.resetForm();

        // Redirigir al login después de 3 segundos
        setTimeout(() => {
          this.router.navigate(['/auth/login']);
        }, 3000);
      },
      error: (error) => {
        console.error('[CAMBIO CONTRASEÑA ESTUDIANTE] Error al cambiar contraseña:', error);
        // Manejamos la respuesta de error, si Spring devuelve un texto en un 400
        const errorBody = error.error || 'Hubo un error al cambiar la contraseña. Por favor, intenta nuevamente.';
        this.errorMessage = errorBody;
        this.isLoading = false;
      }
    });
  }
}