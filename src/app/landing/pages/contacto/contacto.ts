import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ContactoService } from '../../../services/contacto-service';
import { AccordionComponent, AccordionItem } from '../../../shared/components/accordion/accordion';

interface ContactoForm {
  nombre: string;
  correo: string;
  asunto: string;
  mensaje: string;
}

@Component({
  selector: 'app-contacto',
  standalone: true,
  imports: [CommonModule, FormsModule, AccordionComponent],
  templateUrl: './contacto.html',
  styleUrls: ['./contacto.scss']
})
export class Contacto implements OnInit {

  public contactoData: ContactoForm = {
    nombre: '',
    correo: '',
    asunto: '',
    mensaje: ''
  };

  public successMessage: string | null = null;
  public errorMessage: string | null = null;
  public isLoading: boolean = false;

  public faqItems: AccordionItem[] = [
    {
      title: '¿Dónde queda exactamente la academia?',
      content: 'La academia se encuentra en La Molina, Lima, Perú. Puedes ver la ubicación exacta en el mapa de esta página.'
    },
    {
      title: '¿Hay estacionamiento?',
      content: 'Sí, contamos con estacionamiento gratuito para estudiantes y visitantes.'
    },
    {
      title: '¿Cómo me inscribo?',
      content: 'Puedes inscribirte a través de nuestra página web en la sección "Inscripción". Solo necesitas llenar tus datos, seleccionar tus talleres y realizar el pago.'
    },
    {
      title: '¿Cuáles son los métodos de pago?',
      content: 'Aceptamos tarjetas de crédito, débito y transferencias bancarias. Todos los pagos son procesados de forma segura.'
    },
    {
      title: '¿Puedo cancelar mi inscripción?',
      content: 'Sí, puedes cancelar tu inscripción hasta 48 horas antes del inicio de clases. Contáctanos para más detalles sobre el proceso de reembolso.'
    }
  ];

  constructor(
    private contactoService: ContactoService
  ) { }

  ngOnInit(): void {
    console.log('[CONTACTO COMPONENT] Componente inicializado');
  }

  enviarMensaje(formValue: ContactoForm): void {
    this.successMessage = null;
    this.errorMessage = null;
    this.isLoading = true;

    console.log('[CONTACTO] Iniciando envío de mensaje de contacto');
    console.log('[CONTACTO] Datos del formulario:', {
      nombre: formValue.nombre,
      correo: formValue.correo,
      asunto: formValue.asunto,
      mensajeLength: formValue.mensaje.length
    });

    this.contactoService.enviar(formValue).subscribe({
      next: (response) => {
        console.log('[CONTACTO SUCCESS] Mensaje enviado correctamente', response);
        this.successMessage = '¡Gracias! Tu mensaje ha sido enviado exitosamente.';
        this.contactoData = { nombre: '', correo: '', asunto: '', mensaje: '' };
        this.isLoading = false;
      },
      error: (err) => {
        console.error('[CONTACTO ERROR] Error al enviar mensaje:', err);
        console.error('[CONTACTO ERROR] Detalles del error:', {
          status: err.status,
          message: err.message,
          error: err.error
        });
        this.errorMessage = 'Hubo un error al enviar tu mensaje. Por favor, inténtalo de nuevo.';
        this.isLoading = false;
      }
    });
  }
}