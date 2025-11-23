import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Profesor {
    id: number;
    nombreCompleto: string;
    telefono: string;
    fotoUrl: string;
    informacion: string;
}

@Injectable({
    providedIn: 'root'
})
export class ProfesorService {

    private readonly API_URL = 'http://localhost:8080/api/profesores';
    private readonly PROFESOR_API_URL = 'http://localhost:8080/api/profesor';
    private readonly STATIC_URL = 'http://localhost:8080';

    constructor(private http: HttpClient) { }

    getProfesores(): Observable<Profesor[]> {
        return this.http.get<Profesor[]>(this.API_URL);
    }

    getStaticImageUrl(pathOrFileName: string): string {
        if (!pathOrFileName) {
            return '/profesorGuitarra.jpg'; // Imagen por defecto
        }

        if (/^https?:\/\//i.test(pathOrFileName)) {
            return pathOrFileName;
        }

        let cleanPath = pathOrFileName.startsWith('/') ? pathOrFileName.substring(1) : pathOrFileName;

        if (cleanPath.startsWith('images/')) {
            return `${this.STATIC_URL}/${cleanPath}`;
        }

        return `${this.STATIC_URL}/images/${cleanPath}`;
    }

    cambiarClave(data: any): Observable<any> {
        return this.http.post(`${this.PROFESOR_API_URL}/cambiar-clave`, data, {
            responseType: 'text'
        });
    }

    cancelarClase(horarioId: number, data: { fecha: string, motivo: string, accion: string }): Observable<any> {
        return this.http.post(`${this.PROFESOR_API_URL}/cancelar-clase/${horarioId}`, data);
    }
}