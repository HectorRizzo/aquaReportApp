import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AceptarReportePage } from './aceptar-reporte.page';

const routes: Routes = [
  {
    path: '',
    component: AceptarReportePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AceptarReportePageRoutingModule {}
