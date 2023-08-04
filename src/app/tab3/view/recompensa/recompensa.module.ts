import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RecompensaPageRoutingModule } from './recompensa-routing.module';

import { RecompensaPage } from './recompensa.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RecompensaPageRoutingModule
  ],
  declarations: [RecompensaPage]
})
export class RecompensaPageModule {}
