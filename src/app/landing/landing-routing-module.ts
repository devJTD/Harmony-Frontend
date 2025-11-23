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
import { DatosPersonales } from './pages/inscripcion/datos-personales/datos-personales';
import { SeleccionTalleres } from './pages/inscripcion/seleccion-talleres/seleccion-talleres';
import { MetodoPago } from './pages/inscripcion/metodo-pago/metodo-pago';

const routes: Routes = [
  {
    path: '',
    component: Layout,
    children: [
      {
        path: '',
        component: Inicio,
        title: 'Harmony - Inicio'
      },
      {
        path: 'acerca',
        component: Acerca,
        title: 'Harmony - Acerca de'
      },
      {
        path: 'contacto',
        component: Contacto,
        title: 'Harmony - Contacto'
      },
      {
        path: 'blog',
        component: Blog,
        title: 'Harmony - Blog'
      },
      {
        path: 'confirmacion',
        component: Confirmacion,
        title: 'Harmony - Confirmación'
      },
      {
        path: 'inscripcion',
        component: Inscripcion,
        children: [
          {
            path: '',
            redirectTo: 'datos',
            pathMatch: 'full'
          },
          // PASO 1: Datos personales
          {
            path: 'datos',
            component: DatosPersonales,
            title: 'Inscripción - Paso 1: Datos'
          },
          // PASO 2: Selección de talleres. Recibe el ID del cliente
          {
            path: 'talleres/:clienteId',
            component: SeleccionTalleres,
            title: 'Inscripción - Paso 2: Talleres'
          },
          // PASO 3: Pago. Recibe el ID del cliente
          {
            path: 'pago/:clienteId',
            component: MetodoPago,
            title: 'Inscripción - Paso 3: Pago'
          },
        ]
      },
      {
        path: 'profesores',
        component: Profesores,
        title: 'Harmony - Profesores'
      },
      {
        path: 'talleres',
        component: Talleres,
        title: 'Harmony - Talleres'
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LandingRoutingModule { }