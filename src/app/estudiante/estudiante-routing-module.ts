import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Layout } from './pages/layout/layout';
import { Horario } from './pages/horario/horario';
import { Contrasena } from './pages/contrasena/contrasena';
import { NuevaInscripcionComponent } from './pages/nueva-inscripcion/nueva-inscripcion';

const routes: Routes = [
  {
    path: '',
    component: Layout,
    children: [
      {
        path: '',
        redirectTo: 'horario',
        pathMatch: 'full'
      },
      {
        path: 'horario',
        component: Horario,
        title: 'Harmony - Estudiante: Mi Horario'
      },
      {
        path: 'nueva-inscripcion',
        component: NuevaInscripcionComponent,
        title: 'Harmony - Estudiante: Nueva Inscripción'
      },
      {
        path: 'contrasena',
        component: Contrasena,
        title: 'Harmony - Estudiante: Cambiar Contraseña'
      },
      {
        path: '**',
        redirectTo: 'horario'
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EstudianteRoutingModule { }
