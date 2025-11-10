import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { Layout } from './pages/layout/layout';
import { Inicio } from './pages/inicio/inicio';
import { Acerca } from './pages/acerca/acerca';
import { Contacto } from './pages/contacto/contacto';
import { Blog } from './pages/blog/blog';
import { Confirmacion } from './pages/confirmacion/confirmacion';
import { Inscripcion } from './pages/inscripcion/inscripcion';
import { Profesores } from './pages/profesores/profesores';
import { Talleres } from './pages/talleres/talleres';

const routes: Routes = [
  {
    path: '', 
    component: Layout, 
    children: [
      {
        path: '',
        component: Inicio
      },
      {
        path: 'acerca',
        component: Acerca
      },
      {
        path: 'contacto',
        component: Contacto
      },
      {
        path: 'blog',
        component: Blog
      },
      {
        path: 'confirmacion',
        component: Confirmacion
      },
      {
        path: 'inscripcion',
        component: Inscripcion
      },
      {
        path: 'profesores',
        component: Profesores
      },
      {
        path: 'talleres',
        component: Talleres
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LandingRoutingModule { }