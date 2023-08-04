import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OnlyNumbersDirective } from '../directives/only-numbers.directive';

@NgModule({
  declarations: [
    OnlyNumbersDirective
  ],
  imports: [
    CommonModule
  ],
  exports: [
    OnlyNumbersDirective
  ]
})
export class SharedModule { }
