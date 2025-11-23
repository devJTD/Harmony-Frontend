import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Profesor, ProfesorService } from '../../../services/profesor-service';
import { TallerService, TallerDetallado, Horario } from '../../../services/taller-service';

@Component({
  selector: 'app-profesores',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './profesores.html',
  styleUrls: ['./profesores.scss']
})
export class Profesores implements OnInit {

  public profesores: Profesor[] = [];
  public talleresDetallados: TallerDetallado[] = [];
  public profesorSeleccionado: Profesor | null = null;
  public talleresProfesor: { taller: TallerDetallado, horarios: Horario[] }[] = [];

  constructor(
    private profesorService: ProfesorService,
    private tallerService: TallerService
  ) { }

  ngOnInit(): void {
    this.cargarProfesores();
    this.cargarTalleres();
  }

  cargarProfesores(): void {
    this.profesorService.getProfesores().subscribe({
      next: (data) => {
        this.profesores = data.map(profesor => ({
          ...profesor,
          fotoUrl: this.profesorService.getStaticImageUrl(profesor.fotoUrl)
        }));
      },
      error: (error) => {
        console.error('❌ Error al cargar la lista de profesores:', error);
        this.profesores = [];
      }
    });
  }

  cargarTalleres(): void {
    this.tallerService.getTalleresDetalladosActivos().subscribe({
      next: (data) => {
        this.talleresDetallados = data;
      },
      error: (error) => {
        console.error('❌ Error al cargar talleres:', error);
      }
    });
  }

  verDetalleProfesor(profesor: Profesor): void {
    this.profesorSeleccionado = profesor;
    this.talleresProfesor = [];

    this.talleresDetallados.forEach(taller => {
      // Filtrar horarios que coincidan con el nombre del profesor
      const horariosDelProfesor = taller.horariosAbiertos.filter(h =>
        h.profesor && h.profesor.nombreCompleto === profesor.nombreCompleto
      );

      if (horariosDelProfesor.length > 0) {
        this.talleresProfesor.push({
          taller: taller,
          horarios: horariosDelProfesor
        });
      }
    });

    // Scroll al inicio para ver el detalle
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  cerrarDetalle(): void {
    this.profesorSeleccionado = null;
    this.talleresProfesor = [];
  }
}