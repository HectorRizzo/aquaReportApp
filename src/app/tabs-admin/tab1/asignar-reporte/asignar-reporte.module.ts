import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AsignarReportePageRoutingModule } from './asignar-reporte-routing.module';

import { AsignarReportePage } from './asignar-reporte.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AsignarReportePageRoutingModule
  ],
  declarations: [AsignarReportePage]
})
export class AsignarReportePageModule {}
