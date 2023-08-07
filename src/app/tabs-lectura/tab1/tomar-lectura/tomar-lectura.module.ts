import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TomarLecturaPageRoutingModule } from './tomar-lectura-routing.module';

import { TomarLecturaPage } from './tomar-lectura.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TomarLecturaPageRoutingModule
  ],
  declarations: [TomarLecturaPage]
})
export class TomarLecturaPageModule {}
