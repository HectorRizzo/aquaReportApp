import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { Tab1Page } from './tab1.page';

const routes: Routes = [
  {
    path: '',
    component: Tab1Page
  },
  {
    path: 'cerrar-reporte/:reporte_id',
    loadChildren: () => import('./cerrar-reporte/cerrar-reporte.module').then( m => m.CerrarReportePageModule)
  },
  {
    path: 'aceptar-reporte/:reporte_id',
    loadChildren: () => import('./aceptar-reporte/aceptar-reporte.module').then( m => m.AceptarReportePageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class Tab1PageRoutingModule {}
