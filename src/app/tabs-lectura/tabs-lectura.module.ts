import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TabsLecturaPageRoutingModule } from './tabs-lectura-routing.module';

import { TabsLecturaPage } from './tabs-lectura.page';
import { OnlyNumbersDirective } from '../directives/only-numbers.directive';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TabsLecturaPageRoutingModule
  ],
  declarations: [TabsLecturaPage]
})
export class TabsLecturaPageModule {}
