import { Component, OnInit, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { InscripcionService } from '../../../../services/inscripcion-service';

// --- Definiciones de Interfaces (Locales y Corregidas) ---
// Las redefinimos aquí para que TypeScript en este componente
// sepa que la propiedad 'profesor' puede ser null o no existir.

// 1. Interfaz para Profesor (debe ser Profesor o null)
export interface Profesor {
  id: number;
  nombreCompleto: string;
}

// 2. Interfaz para Horario (la corrección clave)
export interface HorarioSeleccion {
  id: number;
  diasDeClase: string;
  horaInicio: string;
  horaFin: string;
  vacantesDisponibles: number;
  // ✅ CORRECCIÓN CLAVE: profesor puede ser null
  profesor?: Profesor | null; 
}

// 3. Interfaz para el Taller, usando el Horario corregido
export interface TallerSeleccion {
  id: number;
  nombre: string;
  precio: number;
  // Usamos el tipo corregido para la lista de horarios
  horarios: HorarioSeleccion[]; 
  seleccionado: boolean;
  horarioSeleccionadoId: number | null;
}
// ---------------------------------------------------------

@Component({
  selector: 'app-seleccion-talleres',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './seleccion-talleres.html',
  styleUrl: './seleccion-talleres.scss',
})
export class SeleccionTalleres implements OnInit {
  private inscripcionService = inject(InscripcionService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  public clienteId: number | null = null;
  public isLoading = true;
  public showError = false;
  
  // ✅ Tipificamos las señales con la interfaz local corregida
  public talleres = this.inscripcionService.talleresDisponibles as () => TallerSeleccion[];
  public totalPagar = this.inscripcionService.totalPagar;
  public talleresMarcados = this.inscripcionService.talleresMarcados as () => TallerSeleccion[];
  
  // ✅ Computed para la validación: Al menos 1 taller marcado Y todos los marcados con horario elegido
  public isSelectionValid = computed(() => {
    // 1. Usa la señal talleresMarcados (Talleres cuyo checkbox está marcado)
    const marcados = this.talleresMarcados(); 
    
    // 2. Si no hay talleres marcados, es falso.
    if (marcados.length === 0) return false;
    
    // 3. Verifica que TODOS los talleres marcados tengan un ID de horario.
    return marcados.every(t => t.horarioSeleccionadoId !== null);
  });

  ngOnInit(): void {
    this.inscripcionService.setPasos(2);
    
    // 1. Obtener ID de la URL
    this.route.paramMap.subscribe(params => {
      const idParam = params.get('clienteId');
      this.clienteId = idParam ? +idParam : null;
      
      console.log('🔵 [SELECCION TALLERES] ClienteId de URL:', this.clienteId);
      
      // 2. Si no hay clienteId, redirigir al paso 1
      if (!this.clienteId || !this.inscripcionService.cliente()) {
        console.warn('⚠️ [SELECCION TALLERES] No hay clienteId o cliente. Redirigiendo a datos personales');
        this.router.navigate(['/inscripcion/datos']);
        return;
      }

      // 3. Cargar talleres si la lista está vacía (solo al inicio)
      if (this.talleres().length === 0) {
        console.log('🔵 [SELECCION TALLERES] Cargando talleres...');
        this.loadTalleres();
      } else {
        console.log('✅ [SELECCION TALLERES] Talleres ya cargados:', this.talleres().length);
        this.isLoading = false;
      }
    });
  }
  
  private loadTalleres(): void {
    this.isLoading = true;
    this.inscripcionService.obtenerTalleres().subscribe({
      next: (talleresApi) => {
        console.log('📥 [SELECCION TALLERES] Talleres recibidos del API:', talleresApi.length);
        
        // ✅ LOG: Mostrar estructura de datos recibidos
        talleresApi.forEach(taller => {
          console.log(`📊 [SELECCION TALLERES] Taller: ${taller.nombre}`);
          console.log(`   - ID: ${taller.id}`);
          console.log(`   - Horarios: ${taller.horarios?.length || 0}`);
          
          // ✅ CRÍTICO: Verificar estructura de horarios
          if (taller.horarios && taller.horarios.length > 0) {
            taller.horarios.forEach((h, idx) => {
              console.log(`     [Horario ${idx}] Profesor:`, h.profesor);
              console.log(`     [Horario ${idx}] Profesor tipo:`, typeof h.profesor);
              console.log(`     [Horario ${idx}] Profesor null?`, h.profesor === null);
              console.log(`     [Horario ${idx}] Profesor undefined?`, h.profesor === undefined);
            });
          }
        });
        
        // Inicializa el estado en el servicio
        this.inscripcionService.setTalleresIniciales(talleresApi);
        console.log('✅ [SELECCION TALLERES] Talleres inicializados en signal');
        this.isLoading = false;
      },
      error: (err) => {
        console.error('❌ [SELECCION TALLERES ERROR] Error al cargar talleres:', err);
        console.error('❌ [SELECCION TALLERES ERROR] Status:', err.status);
        console.error('❌ [SELECCION TALLERES ERROR] Detalles:', err.error);
        this.showError = true;
        this.isLoading = false;
      }
    });
  }

  // Maneja el cambio de checkbox del taller
  toggleTaller(tallerId: number, event: Event): void {
    const isChecked = (event.target as HTMLInputElement).checked;
    console.log(`🔄 [SELECCION TALLERES] Toggle Taller ID ${tallerId}, checked: ${isChecked}`);
    this.inscripcionService.toggleTaller(tallerId, isChecked);
  }

  updateHorario(tallerId: number, horarioId: any): void {
    // ✅ El 'horarioId' es el valor de la opción seleccionada.
    // Como [ngValue] es un number, horarioId ya debería ser un number, 
    // pero lo parseamos para seguridad.
    
    // Si el valor es null (Selecciona un horario), lo mantendrá como null.
    // Si es un número (ID de horario), lo parsea.
    const numericHorarioId = horarioId ? parseInt(horarioId, 10) : null;
    
    console.log(`🎯 [SELECCION TALLERES] Actualizar Horario para Taller ${tallerId}: ${numericHorarioId}`);
    
    // Llama al servicio con el ID numérico o null.
    this.inscripcionService.setHorario(tallerId, numericHorarioId);
  }
  
  // Botón para avanzar al Paso 3
  goToPago(): void {
    if (this.isSelectionValid() && this.clienteId !== null) {
      console.log('✅ [SELECCION TALLERES] Selección válida. Avanzando a pago');
      // El servicio actualizará el paso y la ruta
      this.inscripcionService.setPasos(3);
      this.router.navigate(['/inscripcion', 'pago', this.clienteId]);
    } else {
      console.warn('⚠️ [SELECCION TALLERES] Selección inválida. Mostrando alerta');
      alert('Por favor, selecciona al menos un taller y su horario correspondiente.');
    }
  }
}