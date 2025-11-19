import { Component, OnInit } from '@angular/core';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TallerService } from '../../../services/taller-service';
// Importamos el servicio, pero definimos los tipos localmente para la corrección
// (En una aplicación real, deberías corregir las interfaces en el archivo del servicio).

// --- Definiciones de Interfaces (Simuladas/Corregidas) ---
// La corrección clave es hacer que 'profesor' pueda ser nulo.
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
  // LA CORRECCIÓN: profesor puede ser Profesor o null.
  profesor: Profesor | null; 
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
  providers: [CurrencyPipe, DatePipe, TallerService]
})
export class Talleres implements OnInit {

  // Usamos la interfaz local TallerDetallado
  public talleres: TallerDetallado[] = []; 

  constructor(
    private currencyPipe: CurrencyPipe,
    private datePipe: DatePipe,
    private tallerService: TallerService
  ) { }

  ngOnInit(): void {
    this.cargarTalleres(); 
  }

  /**
   * Carga los talleres activos con sus detalles y horarios desde el REST Controller.
   */
  cargarTalleres(): void {
    // Aquí usamos el TallerDetallado del servicio si es necesario, pero Angular usará
    // la definición local para el componente. 
    // Para simplificar, asumimos que la estructura coincide con la local.
    this.tallerService.getTalleresDetalladosActivos().subscribe({
      next: (data: any) => { // Usamos 'any' temporalmente para no forzar la importación circular
        this.talleres = data.map((taller: any) => ({
          ...taller,
          imagenTaller: this.tallerService.getStaticImageUrl(taller.imagenTaller) 
        })) as TallerDetallado[]; // Casteamos al tipo corregido
        
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