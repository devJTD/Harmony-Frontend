import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // NECESARIO para [(ngModel)] y ngSubmit

// Interfaz para la data del formulario
interface ContactoForm {
  nombre: string;
  correo: string;
  asunto: string;
  mensaje: string;
}

@Component({
  selector: 'app-contacto',
  standalone: true,
  // Importamos FormsModule para manejar el formulario
  imports: [CommonModule, FormsModule], 
  templateUrl: './contacto.html',
  styleUrls: ['./contacto.css']
})
export class Contacto implements OnInit {

  // Modelo de datos para el formulario
  public contactoData: ContactoForm = {
    nombre: '',
    correo: '',
    asunto: '',
    mensaje: ''
  };

  public successMessage: string | null = null;
  public errorMessage: string | null = null;

  constructor(
    // private contactoService: ContactoService // Inyectar servicio de contacto para enviar al backend
  ) { }

  ngOnInit(): void {
  }

  /**
   * Maneja el envío del formulario a la API/Backend.
   * @param formValue Los valores del formulario.
   */
  enviarMensaje(formValue: ContactoForm): void {
    this.successMessage = null;
    this.errorMessage = null;

    console.log('Datos a enviar:', formValue);
    
    // Aquí iría la llamada al servicio de Angular para enviar los datos al endpoint /contacto/enviar
    /*
    this.contactoService.enviar(formValue).subscribe({
      next: (response) => {
        this.successMessage = '¡Gracias! Tu mensaje ha sido enviado exitosamente.';
        // Opcional: Resetear el formulario después del éxito
        this.contactoData = { nombre: '', correo: '', asunto: '', mensaje: '' };
      },
      error: (err) => {
        this.errorMessage = 'Hubo un error al enviar tu mensaje. Por favor, inténtalo de nuevo.';
      }
    });
    */

    // Simulación de éxito (remover esto cuando se implemente el servicio)
    setTimeout(() => {
        this.successMessage = '¡Gracias! Tu mensaje ha sido enviado exitosamente.';
        this.contactoData = { nombre: '', correo: '', asunto: '', mensaje: '' }; // Resetear
    }, 1000);
  }
}