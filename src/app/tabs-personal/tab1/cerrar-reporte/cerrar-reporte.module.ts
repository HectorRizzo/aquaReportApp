import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CerrarReportePageRoutingModule } from './cerrar-reporte-routing.module';

import { CerrarReportePage } from './cerrar-reporte.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CerrarReportePageRoutingModule
  ],
  declarations: [CerrarReportePage]
})
export class CerrarReportePageModule {}
