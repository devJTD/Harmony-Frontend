import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; 
import { Profesor, ProfesorService } from '../../../services/profesor-service';

@Component({
  selector: 'app-profesores',
  standalone: true,
  imports: [CommonModule, FormsModule], 
  templateUrl: './profesores.html',
  styleUrls: ['./profesores.scss']
})
export class Profesores implements OnInit {

  public profesores: Profesor[] = [];

  constructor(private profesorService: ProfesorService) { } 

  ngOnInit(): void {
    this.cargarProfesores();
  }
  
  cargarProfesores(): void {
    this.profesorService.getProfesores().subscribe({
        next: (data) => {
            // ✅ CORREGIDO: El servicio ya maneja URLs externas correctamente
            this.profesores = data.map(profesor => ({
                ...profesor,
                fotoUrl: this.profesorService.getStaticImageUrl(profesor.fotoUrl) 
            }));
            console.log(`✅ Profesores cargados con URLs procesadas: ${this.profesores.length}`);
            this.profesores.forEach(p => {
                console.log(`📸 Profesor ${p.nombreCompleto}: ${p.fotoUrl}`);
            });
        },
        error: (error) => {
            console.error('❌ Error al cargar la lista de profesores:', error);
            this.profesores = []; 
        }
    });
  }
}