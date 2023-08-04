import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TabsPersonalPageRoutingModule } from './tabs-personal-routing.module';

import { TabsPersonalPage } from './tabs-personal.page';
import { OnlyNumbersDirective } from '../directives/only-numbers.directive';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TabsPersonalPageRoutingModule
  ],
  declarations: [TabsPersonalPage]
})
export class TabsPersonalPageModule {}
