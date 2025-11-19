import { CommonModule } from '@angular/common';
import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { AdminService, ClienteDTO, TallerDTO } from '../../../services/admin-service';

interface Horario {
  id: number;
  diasDeClase: string;
  horaInicio: string;
  horaFin: string;
  profesor?: { nombreCompleto: string }; // ✅ CORREGIDO: Hacer opcional
  vacantesDisponibles: number;
}

interface Taller {
  id: number;
  nombre: string;
  horarios: Horario[];
  seleccionado: boolean;
  horarioSeleccionado?: number;
}

// ✅ CORREGIDO: Estructura para inscripciones con null-safety
interface Inscripcion {
  horario?: {
    taller?: { nombre: string };
    diasDeClase?: string;
    horaInicio?: string;
    horaFin?: string;
  };
}

interface Cliente {
  id: number;
  nombreCompleto: string;
  correo: string;
  telefono: string;
  inscripciones: Inscripcion[];
  user?: { email: string }; // ✅ CORREGIDO: Hacer opcional
}

@Component({
  selector: 'app-estudiantes',
  templateUrl: './estudiantes.html',
  styleUrls: ['./estudiantes.scss'],
  imports: [FormsModule, CommonModule]
})
export class Estudiantes implements OnInit {
  talleres: Taller[] = [];
  clientes: Cliente[] = [];
  nombreUsuario: string = '';
  nuevoCliente: any = {};
  clienteAEditar: Cliente | any = {};
  originalCorreo: string = '';
  validationAlert: boolean = false;
  
  successMessage: string = '';
  errorMessage: string = '';

  @ViewChild('editClienteFormRef') editClienteFormRef!: NgForm;
  @ViewChild('editModal') editModal!: ElementRef;

  constructor(private adminService: AdminService) { }

  ngOnInit(): void {
    console.log('🔵 [ESTUDIANTES ANGULAR] Inicializando componente Estudiantes');
    this.cargarTalleresDisponibles();
    this.cargarClientes();
  }

  cargarTalleresDisponibles() {
    console.log('🔵 [ESTUDIANTES ANGULAR] Cargando talleres disponibles...');
    this.adminService.getTalleresDisponibles().subscribe({
      next: (talleresApi: any[]) => {
        console.log('✅ [ESTUDIANTES ANGULAR] Talleres disponibles recibidos:', talleresApi.length);
        
        // ✅ CORREGIDO: Validar que horarios y profesor existan
        this.talleres = talleresApi.map(t => ({
          id: t.id,
          nombre: t.nombre,
          seleccionado: false,
          horarios: (t.horarios || []).map((h: any) => ({
            id: h.id,
            diasDeClase: h.diasDeClase || '',
            horaInicio: h.horaInicio || '',
            horaFin: h.horaFin || '',
            profesor: h.profesor ? { nombreCompleto: h.profesor.nombreCompleto } : undefined,
            vacantesDisponibles: h.vacantesDisponibles || 0
          }))
        }));
        
        console.log('📊 [ESTUDIANTES ANGULAR] Talleres procesados:', this.talleres);
        this.talleres.forEach(t => {
          console.log(`  - ${t.nombre}: ${t.horarios.length} horarios`);
          t.horarios.forEach(h => {
            console.log(`    * ${h.diasDeClase} ${h.horaInicio}-${h.horaFin} (Prof: ${h.profesor?.nombreCompleto || 'Sin asignar'})`);
          });
        });
      },
      error: (err) => {
        console.error('❌ [ESTUDIANTES ANGULAR] Error al cargar talleres:', err);
        this.errorMessage = 'Error al cargar talleres disponibles';
      }
    });
  }

  // ✅ CORREGIDO: Mejorar manejo de inscripciones
  cargarClientes() {
    console.log('🔵 [ESTUDIANTES ANGULAR] Cargando clientes con inscripciones...');
    this.adminService.getClientesConInscripciones().subscribe({
      next: (clientesApi: any[]) => {
        console.log('✅ [ESTUDIANTES ANGULAR] Clientes recibidos:', clientesApi.length);
        
        this.clientes = clientesApi.map(c => ({
          id: c.id,
          nombreCompleto: c.nombreCompleto,
          correo: c.correo,
          telefono: c.telefono,
          user: c.user ? { email: c.user.email } : undefined,
          inscripciones: (c.inscripciones || []).map((ins: any) => ({
            horario: ins.horario ? {
              taller: ins.horario.taller ? { nombre: ins.horario.taller.nombre } : undefined,
              diasDeClase: ins.horario.diasDeClase || '',
              horaInicio: ins.horario.horaInicio || '',
              horaFin: ins.horario.horaFin || ''
            } : undefined
          }))
        } as Cliente));
        
        console.log('📊 [ESTUDIANTES ANGULAR] Clientes procesados:', this.clientes);
        console.log('📋 [ESTUDIANTES ANGULAR] Inscripciones del primer cliente:', 
          this.clientes.length > 0 ? this.clientes[0].inscripciones : 'Sin clientes');
      },
      error: (err) => {
        console.error('❌ [ESTUDIANTES ANGULAR] Error al cargar clientes:', err);
        this.errorMessage = 'Error al cargar la lista de clientes';
      }
    });
  }

  registrarCliente(form: NgForm) {
    console.log('🔵 [ESTUDIANTES ANGULAR] Iniciando registro de cliente');
    this.validationAlert = false;
    this.errorMessage = '';
    this.successMessage = '';
    
    let validSelection = true;
    const talleresSeleccionados: { [key: number]: number } = {};

    this.talleres.forEach(taller => {
      if (taller.seleccionado && taller.horarios.length > 0 && !taller.horarioSeleccionado) {
        validSelection = false;
        console.warn('⚠️ [ESTUDIANTES ANGULAR] Taller sin horario:', taller.nombre);
      }
      
      if (taller.seleccionado && taller.horarioSeleccionado) {
        talleresSeleccionados[taller.id] = taller.horarioSeleccionado;
        console.log('✔️ [ESTUDIANTES ANGULAR] Taller seleccionado:', taller.id, '-> Horario:', taller.horarioSeleccionado);
      }
    });

    if (!validSelection) {
      this.validationAlert = true;
      console.error('❌ [ESTUDIANTES ANGULAR] Validación fallida: falta seleccionar horarios');
      return;
    }

    if (form.valid) {
      const payload = {
        nombreCompleto: this.nuevoCliente.nombreCompleto,
        correo: this.nuevoCliente.correo,
        telefono: this.nuevoCliente.telefono,
        talleresSeleccionados: talleresSeleccionados
      };
      
      console.log('📤 [ESTUDIANTES ANGULAR] Enviando payload:', payload);

      this.adminService.createCliente(payload).subscribe({
        next: (response: any) => {
          console.log('✅ [ESTUDIANTES ANGULAR SUCCESS] Cliente registrado:', response);
          this.successMessage = `Cliente registrado exitosamente. Correo: ${response.email}, Contraseña temporal: ${response.temporalPassword}`;
          
          form.resetForm();
          this.talleres.forEach(t => { 
            t.seleccionado = false; 
            t.horarioSeleccionado = undefined; 
          });
          this.cargarClientes();
          
          setTimeout(() => {
            this.successMessage = '';
          }, 8000);
        },
        error: (err) => {
          console.error('❌ [ESTUDIANTES ANGULAR ERROR] Error al registrar cliente:', err);
          this.errorMessage = err.error?.message || 'Error al registrar el cliente';
        }
      });
    } else {
      console.warn('⚠️ [ESTUDIANTES ANGULAR] Formulario inválido');
    }
  }

  openEditModal(cliente: Cliente) {
    console.log('🔵 [ESTUDIANTES ANGULAR] Abriendo modal de edición para cliente:', cliente.id);
    this.clienteAEditar = {
      id: cliente.id,
      nombre: cliente.nombreCompleto,
      correo: cliente.user?.email || cliente.correo,
      telefono: cliente.telefono
    };
    this.originalCorreo = cliente.user?.email || cliente.correo;
    console.log('📝 [ESTUDIANTES ANGULAR] Datos a editar:', this.clienteAEditar);
  }

  editarCliente(form: NgForm) {
    console.log('🔵 [ESTUDIANTES ANGULAR] Iniciando edición de cliente ID:', this.clienteAEditar.id);
    
    if (form.valid) {
      const payload = {
        nombreCompleto: this.clienteAEditar.nombre,
        correo: this.clienteAEditar.correo,
        telefono: this.clienteAEditar.telefono
      };
      
      console.log('📤 [ESTUDIANTES ANGULAR] Enviando payload de edición:', payload);

      this.adminService.updateCliente(this.clienteAEditar.id, payload).subscribe({
        next: (response: any) => {
          console.log('✅ [ESTUDIANTES ANGULAR SUCCESS] Cliente actualizado:', response);
          this.successMessage = 'Cliente actualizado exitosamente';
          this.cargarClientes();
          
          const modalElement = document.getElementById('estudiantes-editModal');
          if (modalElement) {
            const modal = (window as any).bootstrap.Modal.getInstance(modalElement);
            if (modal) modal.hide();
          }
          
          setTimeout(() => {
            this.successMessage = '';
          }, 5000);
        },
        error: (err) => {
          console.error('❌ [ESTUDIANTES ANGULAR ERROR] Error al editar cliente:', err);
          this.errorMessage = err.error?.message || 'Error al actualizar el cliente';
        }
      });
    }
  }

  confirmBajaSegura(cliente: Cliente) {
    console.log('🔵 [ESTUDIANTES ANGULAR] Confirmando baja de cliente:', cliente.id);
    
    if (confirm(`¿Estás seguro de que deseas eliminar completamente al cliente ${cliente.nombreCompleto} (ID: ${cliente.id})? Esta acción es irreversible.`)) {
      console.log('📤 [ESTUDIANTES ANGULAR] Eliminando cliente ID:', cliente.id);
      
      this.adminService.deleteCliente(cliente.id).subscribe({
        next: (response: any) => {
          console.log('✅ [ESTUDIANTES ANGULAR SUCCESS] Cliente eliminado:', response);
          this.successMessage = 'Cliente eliminado exitosamente';
          this.cargarClientes();
          
          setTimeout(() => {
            this.successMessage = '';
          }, 5000);
        },
        error: (err) => {
          console.error('❌ [ESTUDIANTES ANGULAR ERROR] Error al eliminar cliente:', err);
          this.errorMessage = err.error?.message || 'Error al eliminar el cliente';
        }
      });
    } else {
      console.log('⚠️ [ESTUDIANTES ANGULAR] Eliminación cancelada por el usuario');
    }
  }
}