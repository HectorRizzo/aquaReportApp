import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AceptarReportePageRoutingModule } from './aceptar-reporte-routing.module';

import { AceptarReportePage } from './aceptar-reporte.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AceptarReportePageRoutingModule
  ],
  declarations: [AceptarReportePage]
})
export class AceptarReportePageModule {}
