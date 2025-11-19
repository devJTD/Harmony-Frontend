import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { DataTransferService } from '../../../services/data-transfer-service';

@Component({
  selector: 'app-confirmacion',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './confirmacion.html',
  styleUrls: ['./confirmacion.scss']
})
export class Confirmacion implements OnInit {

  public correo: string = '';
  public contrasena: string = '';

  constructor(
    private dataTransferService: DataTransferService,
    private router: Router
  ) { }

  ngOnInit(): void {
    console.log('[LOG CONFIRMACION] Componente inicializado');
    
    // ✅ OBTENER Y LIMPIAR las credenciales del servicio
    const credenciales = this.dataTransferService.getCredenciales();

    if (credenciales) {
      this.correo = credenciales.correo;
      this.contrasena = credenciales.contrasenaTemporal;
      console.log('[LOG CONFIRMACION] Credenciales cargadas correctamente');
      console.log('[LOG CONFIRMACION] Correo:', this.correo);
    } else {
      console.warn('[LOG CONFIRMACION] No se encontraron credenciales. Redirigiendo a inicio.');
      this.router.navigate(['/']);
    }
  }
}