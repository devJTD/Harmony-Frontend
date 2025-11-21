import { Component, OnInit } from '@angular/core';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TallerService } from '../../../services/taller-service';
import { ProfesorService } from '../../../services/profesor-service';

// --- Definiciones de Interfaces (Simuladas/Corregidas) ---
export interface Profesor {
  id: number;
  nombreCompleto: string;
  // Añade otros campos si los tienes
}

export interface Horario {
  id: string;
  diasDeClase: string;
  horaInicio: string;
  horaFin: string;
  fechaInicio: string;
  vacantesDisponibles: number;
  profesor: Profesor | null;
  profesorId?: number; // Added for the fix
}

export interface TallerDetallado {
  id: string;
  nombre: string;
  descripcion: string;
  precio: number;
  duracionSemanas: number;
  clasesPorSemana: number;
  temas: string;
  imagenTaller: string;
  horariosAbiertos: Horario[];
  tieneHorariosDefinidos: boolean;
}
// ---------------------------------------------------------

@Component({
  selector: 'app-talleres',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './talleres.html',
  styleUrls: ['./talleres.scss'],
  providers: [CurrencyPipe, DatePipe, TallerService, ProfesorService]
})
export class Talleres implements OnInit {

  public talleres: TallerDetallado[] = [];
  public profesores: Profesor[] = [];

  constructor(
    private currencyPipe: CurrencyPipe,
    private datePipe: DatePipe,
    private tallerService: TallerService,
    private profesorService: ProfesorService
  ) { }

  ngOnInit(): void {
    // Primero cargamos profesores para poder mapearlos
    this.cargarProfesores();
  }

  cargarProfesores(): void {
    this.profesorService.getProfesores().subscribe({
      next: (data: any[]) => {
        this.profesores = data.map(p => ({
          id: p.id,
          nombreCompleto: p.nombreCompleto
        }));
        console.log('✅ Profesores cargados para referencia:', this.profesores.length);
        this.cargarTalleres();
      },
      error: (err) => {
        console.error('❌ Error al cargar profesores:', err);
        this.cargarTalleres();
      }
    });
  }

  /**
   * Carga los talleres activos con sus detalles y horarios desde el REST Controller.
   */
  cargarTalleres(): void {
    this.tallerService.getTalleresDetalladosActivos().subscribe({
      next: (data: any) => {
        this.talleres = data.map((taller: any) => {

          // Procesar horarios para asegurar que tengan profesor
          const horariosProcesados = (taller.horariosAbiertos || []).map((h: any) => {
            // Si no tiene objeto profesor, pero tiene profesorId, lo buscamos
            if (!h.profesor && h.profesorId) {
              const foundProf = this.profesores.find(p => p.id === h.profesorId);
              if (foundProf) {
                return { ...h, profesor: foundProf };
              }
            }
            // Si 'profesor' viene como número (ID) en lugar de objeto
            if (h.profesor && typeof h.profesor === 'number') {
              const foundProf = this.profesores.find(p => p.id === h.profesor);
              if (foundProf) {
                return { ...h, profesor: foundProf };
              }
            }
            return h;
          });

          return {
            ...taller,
            imagenTaller: this.tallerService.getStaticImageUrl(taller.imagenTaller),
            horariosAbiertos: horariosProcesados
          };
        }) as TallerDetallado[];

        console.log('✅ Talleres cargados exitosamente:', this.talleres.length);
        this.talleres.forEach(t => {
          console.log(`📸 Taller ${t.nombre}: ${t.imagenTaller}`);
        });
      },
      error: (error) => {
        console.error('❌ Error al cargar los talleres detallados:', error);
      }
    });
  }

  formatPrecio(precio: number): string | null {
    return this.currencyPipe.transform(precio, 'PEN', 'symbol', '1.2-2', 'es-PE');
  }

  formatHora(hora: string): string | null {
    const [h, m, s] = hora.split(':');
    const date = new Date(1, 1, 1, parseInt(h), parseInt(m), parseInt(s));
    return this.datePipe.transform(date, 'HH:mm');
  }

  formatFecha(fecha: string): string | null {
    return this.datePipe.transform(fecha, 'dd-MM-yyyy');
  }

  getDiasRestantes(fechaInicio: string): number {
    const inicio = new Date(fechaInicio);
    const hoy = new Date();
    inicio.setHours(0, 0, 0, 0);
    hoy.setHours(0, 0, 0, 0);

    const diffTime = inicio.getTime() - hoy.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return Math.max(0, diffDays);
  }
}