import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CerrarReportePage } from './cerrar-reporte.page';

const routes: Routes = [
  {
    path: '',
    component: CerrarReportePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CerrarReportePageRoutingModule {}
