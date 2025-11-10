import { Injectable } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Taller } from '../landing/pages/inscripcion/inscripcion';

// --- Interfaces para la Comunicación REST ---

// 1. Interfaz para los detalles de Taller/Horario enviados
interface InscripcionDetalle {
    tallerId: number;
    horarioId: number;
}

// 2. Interfaz para el Payload (Cuerpo) del POST
export interface InscripcionPayload {
    nombre: string;
    email: string;
    telefono: string;
    
    // Mapeamos los campos de pago planos, NO como objeto 'pago' anidado
    numeroTarjeta: string; 
    fechaVencimiento: string;
    cvv: string;
    
    inscripciones: InscripcionDetalle[];
}

// 3. Interfaz para la Respuesta (Response) del POST
export interface InscripcionResponse {
    correo: string;
    contrasenaTemporal: string;
}

@Injectable({
    providedIn: 'root'
})
export class InscripcionService {
    
    private apiUrl = 'http://localhost:8080/api/inscripcion'; 

    constructor(private http: HttpClient) { }

    /**
     * [GET] Obtiene la lista de talleres disponibles.
     */
    getTalleresDisponibles(): Observable<Taller[]> {
        return this.http.get<Taller[]>(`${this.apiUrl}/talleresDisponibles`);
    }

    /**
     * [POST] Envía los datos de inscripción y pago.
     */
    inscribir(payload: InscripcionPayload): Observable<InscripcionResponse> {
        return this.http.post<InscripcionResponse>(`${this.apiUrl}/confirmar`, payload);
    }
}