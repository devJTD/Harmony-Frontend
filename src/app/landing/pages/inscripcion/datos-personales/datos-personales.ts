import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { DatosPersonalesForm, InscripcionService } from '../../../../services/inscripcion-service';
import { HttpErrorResponse } from '@angular/common/http'; // Importación necesaria si quieres ser más específico

@Component({
  selector: 'app-datos-personales',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './datos-personales.html',
  styleUrl: './datos-personales.css',
})
export class DatosPersonales implements OnInit {
  private inscripcionService = inject(InscripcionService);

  datos: DatosPersonalesForm = {
    nombre: '',
    email: '',
    telefono: ''
  };

  isLoading = false;
  successMessage: string | null = null;
  errorMessage: string | null = null;

  ngOnInit(): void {
    console.log('[LOG DATOS-PERSONALES] Inicializando componente DatosPersonales (Paso 1)');
    this.inscripcionService.setPasos(1);
    const cliente = this.inscripcionService.cliente();
    if (cliente) {
      console.log('[LOG DATOS-PERSONALES] Precargando datos: ' + cliente.correo);
      this.datos = { nombre: cliente.nombreCompleto, email: cliente.correo, telefono: cliente.telefono };
    }
  }
  clearError() {
    this.errorMessage = null;
    this.successMessage = null; // Opcional, pero buena práctica
  }
  submitDatos(form: NgForm) {
    if (form.valid) {
      this.isLoading = true;
      this.successMessage = null;
      this.errorMessage = null;

      const datosCliente: DatosPersonalesForm = form.value;
      console.log('[LOG DATOS-PERSONALES] Enviando datos personales. Email: ' + datosCliente.email);

      this.inscripcionService.guardarDatosPersonales(datosCliente).subscribe({
        next: (clienteGuardado) => {
          console.log('[LOG DATOS-PERSONALES] Cliente guardado con éxito. ID: ' + clienteGuardado.id + ', Email: ' + clienteGuardado.correo);
          this.inscripcionService.setCliente(clienteGuardado);
          this.successMessage = "¡Datos guardados! Pulsa 'Continuar' para seleccionar tu taller.";
        },
        error: (err: HttpErrorResponse) => { // Especificamos el tipo de error
          console.error('[LOG DATOS-PERSONALES] Error al registrar datos personales:', err);

          if (err.status === 409 || err.status === 400) {
            // VERIFICACIÓN CLAVE: Si el status es 409 (Conflict) o 400 (Bad Request),
            // ASUMIMOS que es el error de cuenta duplicada y usamos el mensaje amigable.
            this.errorMessage = "Ya tienes una cuenta activa con este correo. Por favor, inicia sesión para continuar.";
          }
          else if (err.error && err.error.message) {
            // Si el backend envió un mensaje claro, lo usamos.
            this.errorMessage = err.error.message;
          } else {
            // Caso por defecto para errores de red o servidor no manejados.
            this.errorMessage = "Error desconocido al guardar los datos. Revisa el estado de la conexión.";
          }
          this.isLoading = false;
        },
        complete: () => {
          this.isLoading = false;
        }
      });
    }
  }
}