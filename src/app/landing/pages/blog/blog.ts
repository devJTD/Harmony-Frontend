import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; // Mínimo requerido

@Component({
  selector: 'app-blog',
  standalone: true,
  // Solo se requieren los módulos de Angular básicos
  imports: [CommonModule], 
  templateUrl: './blog.html',
  styleUrls: ['./blog.css']
})
export class Blog implements OnInit {

  constructor() { }

  ngOnInit(): void {
    // Es estático, no requiere lógica de inicialización ni carga de datos.
  }
}