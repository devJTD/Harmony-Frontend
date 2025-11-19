import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../services/auth-service';
import { HttpClient } from '@angular/common/http';

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
  imports: [CommonModule],
  templateUrl: './horario.html',
  styleUrl: './horario.scss',
})

export class Horario implements OnInit {
  private authService = inject(AuthService);
  private http = inject(HttpClient);

  public userName: string = '';
  public horarios: HorarioModel[] = [];
  public isLoading: boolean = true;
  public errorMessage: string | null = null;

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
}