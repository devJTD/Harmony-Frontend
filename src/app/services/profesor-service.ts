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
    private readonly STATIC_URL = 'http://localhost:8080';

    constructor(private http: HttpClient) { }

    getProfesores(): Observable<Profesor[]> {
        return this.http.get<Profesor[]>(this.API_URL);
    }
    
    /**
     * ✅ CORREGIDO: Maneja tanto URLs externas como rutas locales
     */
    getStaticImageUrl(pathOrFileName: string): string {
        if (!pathOrFileName) {
            return '/profesorGuitarra.jpg'; // Imagen por defecto
        }
        
        // ✅ Si ya es una URL completa (http:// o https://), devolverla tal cual
        if (/^https?:\/\//i.test(pathOrFileName)) {
            return pathOrFileName;
        }
        
        // Si es una ruta local, construir la URL completa
        let cleanPath = pathOrFileName.startsWith('/') ? pathOrFileName.substring(1) : pathOrFileName;
        
        if (cleanPath.startsWith('images/')) {
            return `${this.STATIC_URL}/${cleanPath}`;
        }
        
        return `${this.STATIC_URL}/images/${cleanPath}`;
    }
}