import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../services/auth-service';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { ProfesorService } from '../../../services/profesor-service';

interface HorarioModel {
  id: number;
  diasDeClase: string;
  horaInicio: string;
  horaFin: string;
  taller: {
    nombre: string;
  };
  profesor: {
    nombreCompleto: string;
  };
}

@Component({
  selector: 'app-horario',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './horario.html',
  styleUrl: './horario.scss',
})

export class Horario implements OnInit {
  private authService = inject(AuthService);
  private profesorService = inject(ProfesorService);
  private http = inject(HttpClient);

  public userName: string = '';
  public horarios: HorarioModel[] = [];
  public isLoading: boolean = true;
  public errorMessage: string | null = null;

  // Modal state
  public showModal: boolean = false;
  public selectedHorario: HorarioModel | null = null;
  public cancelacionData = {
    fecha: '',
    motivo: '',
    accion: ''
  };

  // RUTA CORREGIDA: Apunta al endpoint del profesor
  private readonly API_URL = 'http://localhost:8080/api/profesor/horarios';

  ngOnInit(): void {
    console.log('[HORARIO PROFESOR] Inicializando componente');

    const userInfo = this.authService.getUserInfo();
    if (userInfo) {
      this.userName = userInfo.nombreCompleto || userInfo.email;
    }

    this.cargarHorarios();
  }

  private cargarHorarios(): void {
    // LOGS CORREGIDOS: Indicando que es el horario del profesor
    console.log('[HORARIO PROFESOR] Cargando horarios del profesor');

    this.http.get<HorarioModel[]>(this.API_URL).subscribe({
      next: (horarios) => {
        console.log('[HORARIO PROFESOR] Horarios cargados:', horarios.length);
        this.horarios = horarios;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('[HORARIO PROFESOR] Error al cargar horarios:', error);
        this.errorMessage = 'No se pudieron cargar los horarios. Por favor, intenta más tarde.';
        this.isLoading = false;
      }
    });
  }

  formatHora(hora: string): string {
    // Formato HH:mm:ss -> HH:mm
    return hora.substring(0, 5);
  }

  abrirModalCancelacion(horario: HorarioModel): void {
    this.selectedHorario = horario;
    this.showModal = true;
    this.cancelacionData = { fecha: '', motivo: '', accion: '' };
  }

  cerrarModal(): void {
    this.showModal = false;
    this.selectedHorario = null;
  }

  confirmarCancelacion(): void {
    if (!this.selectedHorario || !this.cancelacionData.fecha || !this.cancelacionData.motivo || !this.cancelacionData.accion) {
      alert('Por favor completa todos los campos');
      return;
    }

    this.profesorService.cancelarClase(this.selectedHorario.id, this.cancelacionData).subscribe({
      next: () => {
        alert('Clase cancelada correctamente. Se ha notificado al administrador.');
        this.cerrarModal();
      },
      error: (err) => {
        console.error('Error al cancelar clase:', err);
        alert('Error al cancelar la clase.');
      }
    });
  }
}