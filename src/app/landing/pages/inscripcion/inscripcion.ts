import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe, DecimalPipe } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule, NgForm } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { InscripcionPayload, InscripcionService } from '../../../services/inscripcion-service';
import { CredencialesTransferencia, DataTransferService } from '../../../services/data-transfer-service';

export interface Horario {
  id: number;
  diasDeClase: string;
  horaInicio: string;
  horaFin: string;
  profesor: {
    nombreCompleto: string;
  };
  vacantesDisponibles: number;
}

export interface Taller {
  id: number;
  nombre: string;
  precio: number;
  horarios: Horario[];
  seleccionado: boolean;
  horarioSeleccionadoId: number | null;
  horarioSeleccionado?: Horario;
}

export interface InscripcionData {
  nombre: string;
  email: string;
  telefono: string;
  pago: {
    numeroTarjeta: string;
    fechaVencimiento: string;
    cvv: string;
  };
}


@Component({
  selector: 'app-inscripcion',
  standalone: true,
  imports: [CommonModule, FormsModule, DecimalPipe, HttpClientModule],
  providers: [InscripcionService],
  templateUrl: './inscripcion.html',
  styleUrls: ['./inscripcion.css']
})
export class Inscripcion implements OnInit {

  public talleres: Taller[] = [];
  public inscripcionData: InscripcionData = {
    nombre: '', email: '', telefono: '',
    pago: { numeroTarjeta: '', fechaVencimiento: '', cvv: '' }
  };

  public subtotal: number = 0;
  public totalPagar: number = 0;
  public showTallerValidationError: boolean = false;
  public talleresSeleccionadosValidos: Taller[] = [];

  constructor(
    private router: Router,
    private inscripcionService: InscripcionService,
    private dataTransferService: DataTransferService
  ) { }

  ngOnInit(): void {
    this.cargarTalleres();
  }

  // =======================================================
  // ⚠️ MÉTODOS AÑADIDOS PARA RESOLVER LOS ERRORES DEL TEMPLATE ⚠️
  // =======================================================

  /**
   * Alterna la selección de un taller y llama a la actualización del resumen.
   */
  toggleTaller(tallerId: number, event: Event): void {
    const isChecked = (event.target as HTMLInputElement).checked;
    const taller = this.talleres.find(t => t.id === tallerId);

    if (taller) {
      taller.seleccionado = isChecked;

      // Si se deselecciona, limpia el horario seleccionado para ese taller.
      if (!isChecked) {
        taller.horarioSeleccionadoId = null;
        taller.horarioSeleccionado = undefined;
      } else {
        // Si se selecciona, asegúrate de que al menos tenga null, no undefined.
        taller.horarioSeleccionadoId = taller.horarioSeleccionadoId || null;
      }

      this.updateSummary();
    }
  }

  /**
   * Actualiza el resumen de la inscripción y calcula el total a pagar.
   */
  updateSummary(): void {
    this.subtotal = 0;

    // Filtra los talleres seleccionados y mapea sus horarios
    this.talleresSeleccionadosValidos = this.talleres
      .filter(t => t.seleccionado)
      .map(taller => {
        // Busca el objeto Horario completo por el ID seleccionado
        taller.horarioSeleccionado = taller.horarios.find(h => h.id === taller.horarioSeleccionadoId);

        // Si está seleccionado y tiene un horario válido, suma al subtotal
        if (taller.horarioSeleccionadoId !== null && taller.horarioSeleccionado) {
          this.subtotal += taller.precio;
        }

        return taller;
      });

    this.totalPagar = this.subtotal;

    // Ocultar el error de validación de talleres si ya hay alguno seleccionado y con horario
    const talleresConHorario = this.talleresSeleccionadosValidos.filter(t => t.horarioSeleccionadoId !== null);
    if (talleresConHorario.length > 0) {
      this.showTallerValidationError = false;
    }
  }

  // =======================================================
  // FIN MÉTODOS AÑADIDOS
  // =======================================================

  cargarTalleres(): void {
    this.inscripcionService.getTalleresDisponibles().subscribe({
      next: (data) => {
        this.talleres = data.map(taller => ({
          ...taller,
          seleccionado: false,
          horarioSeleccionadoId: null,
          horarioSeleccionado: undefined
        }));
        // Inicializa el resumen después de cargar los datos
        this.updateSummary();
      },
      error: (err) => {
        console.error('Error al cargar los talleres:', err);
        alert('No se pudieron cargar los talleres. Revise la conexión al backend.');
      }
    });
  }

  /**
   * Lógica de envío final al backend REST.
   */
  submitInscripcion(form: NgForm): void {
    this.showTallerValidationError = false;

    // 1. Validación de talleres
    const talleresConHorario = this.talleres
      .filter(t => t.seleccionado && t.horarioSeleccionadoId !== null) as Taller[];

    if (talleresConHorario.length === 0) {
      this.showTallerValidationError = true;
      // Opcional: enfocar la vista al inicio de la sección de talleres
      document.getElementById('scheduleContainer')?.scrollIntoView({ behavior: 'smooth' });
      return;
    }

    // 2. Si el formulario y los talleres son válidos
    if (form.valid) {

      // CONSTRUIR EL PAYLOAD
      const payload: InscripcionPayload = {
        // Datos personales
        nombre: this.inscripcionData.nombre,
        email: this.inscripcionData.email,
        telefono: this.inscripcionData.telefono,

        // Datos de pago
        numeroTarjeta: this.inscripcionData.pago.numeroTarjeta,
        fechaVencimiento: this.inscripcionData.pago.fechaVencimiento,
        cvv: this.inscripcionData.pago.cvv,

        // Lista de IDs de inscripción
        inscripciones: talleresConHorario.map(t => ({
          tallerId: t.id,
          horarioId: t.horarioSeleccionadoId!
        }))
      };

      // 3. Llamada al servicio de inscripción
      this.inscripcionService.inscribir(payload).subscribe({
        next: (response) => {
          console.log('Inscripción exitosa. Redirigiendo...');
          // Redireccionar con los datos de la respuesta
          // 🚨 CAMBIO AQUI: 
          // 1. GUARDAR los datos en el servicio.
          const credenciales: CredencialesTransferencia = {
            correo: response.correo,
            contrasenaTemporal: response.contrasenaTemporal
          };
          this.dataTransferService.setCredenciales(credenciales);

          // 2. Redireccionar SIN queryParams.
          this.router.navigate(['/confirmacion']);
        },
        error: (err) => {
          console.error('Error en la inscripción/pago:', err);
          const errorMessage = err.error?.mensaje || 'Error desconocido en el servidor.';
          alert(`Error en la inscripción: ${errorMessage}`);
        }
      });

  } else {
  console.log('Formulario inválido. Revise los campos.');
  form.control.markAllAsTouched();
}
  }
}