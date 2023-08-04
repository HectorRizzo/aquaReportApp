import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RecompensaPage } from './recompensa.page';

const routes: Routes = [
  {
    path: '',
    component: RecompensaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RecompensaPageRoutingModule {}
