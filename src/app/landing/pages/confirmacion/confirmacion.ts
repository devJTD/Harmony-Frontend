import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router'; // Importar Router
import { DataTransferService } from '../../../services/data-transfer-service';

@Component({
  selector: 'app-confirmacion',
  standalone: true,
  imports: [CommonModule, RouterLink], 
  templateUrl: './confirmacion.html',
  styleUrls: ['./confirmacion.css']
})
export class Confirmacion implements OnInit {

  public correo: string | null = null;
  public contrasena: string | null = null;

  constructor(
    // INYECTAR NUEVO SERVICIO Y ROUTER
    private dataTransferService: DataTransferService,
    private router: Router 
  ) { }

  ngOnInit(): void {
    // 🚨 CAMBIO AQUI:
    // 1. OBTENER y LIMPIAR las credenciales del servicio.
    const credenciales = this.dataTransferService.getCredenciales();

    if (credenciales) {
        this.correo = credenciales.correo;
        this.contrasena = credenciales.contrasenaTemporal;
        console.log("Credenciales cargadas desde el servicio de transferencia.");
    } else {
        // 2. Si no hay credenciales (e.g., el usuario recargó la página o llegó directamente), 
        // redirigir a una página segura o mostrar un mensaje genérico.
        console.warn("Acceso directo o recarga de la página de confirmación sin datos. Redirigiendo a home.");
        // this.router.navigate(['/']); // Redirigir a la página principal o de inscripción
        
        // Si no rediriges, se mostrarán los valores por defecto del HTML.
    }
  }
}