import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AsignarReportePage } from './asignar-reporte.page';

const routes: Routes = [
  {
    path: '',
    component: AsignarReportePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AsignarReportePageRoutingModule {}
