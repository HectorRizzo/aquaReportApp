import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TomarLecturaPage } from './tomar-lectura.page';

const routes: Routes = [
  {
    path: '',
    component: TomarLecturaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TomarLecturaPageRoutingModule {}
