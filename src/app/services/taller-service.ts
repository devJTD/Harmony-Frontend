import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Profesor {
    nombreCompleto: string;
}

export interface Horario {
    id: number;
    diasDeClase: string;
    horaInicio: string;
    horaFin: string;
    fechaInicio: string;
    vacantesDisponibles: number;
    profesor?: Profesor | null;
}

export interface TallerDetallado { 
    id: number;
    nombre: string;
    descripcion: string;
    imagenTaller: string;
    duracionSemanas: number;
    clasesPorSemana: number;
    precio: number;
    temas: string;
    horariosAbiertos: Horario[]; 
    tieneHorariosDefinidos: boolean;
}

export interface TallerSimple { 
    id: number;
    nombre: string;
    duracionSemanas: number;
    clasesPorSemana: number;
    precio: number;
    imagenInicio: string;
}

@Injectable({
  providedIn: 'root'
})
export class TallerService {

  private readonly API_URL = 'http://localhost:8080/api/talleres';
  private readonly STATIC_URL = 'http://localhost:8080';

  constructor(private http: HttpClient) { }

  getTalleresActivos(): Observable<TallerSimple[]> {
    return this.http.get<TallerSimple[]>(`${this.API_URL}/activos`);
  }
  
  getTalleresDetalladosActivos(): Observable<TallerDetallado[]> {
    return this.http.get<TallerDetallado[]>(`${this.API_URL}/detallados/activos`);
  }
  
  /**
   * ✅ CORREGIDO: Maneja tanto URLs externas como rutas locales
   */
  getStaticImageUrl(relativePath: string): string {
    if (!relativePath) {
      return '/default-taller.jpg'; // Imagen por defecto
    }
    
    // ✅ Si ya es una URL completa (http:// o https://), devolverla tal cual
    if (/^https?:\/\//i.test(relativePath)) {
      return relativePath;
    }
    
    // Si es una ruta relativa, construir la URL completa
    return `${this.STATIC_URL}${relativePath}`;
  }
}