import { Component, OnInit } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TallerSimple as Taller, TallerService as TallerApiService } from '../../../services/taller-service';

@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [CommonModule, RouterLink, CurrencyPipe],
  templateUrl: './inicio.html',
  styleUrls: ['./inicio.scss']
})
export class Inicio implements OnInit {

  public talleres: Taller[] = [];
  public currentYear: number = new Date().getFullYear();

  constructor(private tallerService: TallerApiService) { }

  /**
   * ✅ CORREGIDO: El servicio ya maneja URLs externas correctamente
   */
  getStaticImageUrl(relativePath: string): string {
    return this.tallerService.getStaticImageUrl(relativePath);
  }

  ngOnInit(): void {
    this.tallerService.getTalleresActivos().subscribe({
      next: (data) => {
        this.talleres = data;
        console.log("✅ Talleres cargados en Angular (Inicio):", this.talleres.length);
        this.talleres.forEach(t => {
          console.log(`📸 Taller ${t.nombre}: ${t.imagenInicio}`);
        });
      },
      error: (err) => {
        console.error("❌ Error al cargar los talleres:", err);
      }
    });
  }
}