import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Layout } from './pages/layout/layout';
import { Estudiantes } from './pages/estudiantes/estudiantes';
import { Profesores } from './pages/profesores/profesores';
import { Talleres } from './pages/talleres/talleres';

const routes: Routes = [
  {
    path: '',
    component: Layout,
    children: [

      {
        path: 'estudiantes',
        component: Estudiantes,
        title: 'Harmony - Admin: Estudiantes'
      },
      {
        path: 'profesores',
        component: Profesores,
        title: 'Harmony - Admin: Profesores'
      },
      {
        path: 'talleres',
        component: Talleres,
        title: 'Harmony - Admin: Talleres'
      },
      {
        path: '**',
        redirectTo: 'estudiantes'
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
