import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthAdminGuard } from './guards/auth-admin.guard';
import { AuthEspolGuard } from './guards/auth-espol.guard';
import { AuthPersonalGuard } from './guards/auth-personal.guard';
import { AuthLecturaGuard } from './guards/auth-lectura.guard';
import { NoAuthGuard } from './guards/no-auth.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/home',
    pathMatch: 'full'
  },
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule),
    canActivate: [NoAuthGuard]
  },
  {
    path: 'login',
    loadChildren: () => import('./login/login.module').then( m => m.LoginPageModule),
    canActivate: [NoAuthGuard]
  },
  {
    path: 'signup',
    loadChildren: () => import('./signup/signup.module').then( m => m.SignupPageModule),
    canActivate: [NoAuthGuard]
  },
  {
    path: 'forgot-pass',
    loadChildren: () => import('./forgot-pass/forgot-pass.module').then( m => m.ForgotPassPageModule),
    canActivate: [NoAuthGuard]
  },
  {
    path: 'tabs',
    loadChildren: () => import('./tabs/tabs.module').then(m => m.TabsPageModule),
    canActivate: [AuthEspolGuard]
  },
  {
    path: 'tabs-admin',
    loadChildren: () => import('./tabs-admin/tabs-admin.module').then( m => m.TabsAdminPageModule),
    canActivate: [AuthAdminGuard]
  },
  {
    path: 'tabs-personal',
    loadChildren: () => import('./tabs-personal/tabs-personal.module').then( m => m.TabsPersonalPageModule),
    canActivate: [AuthPersonalGuard]
  },
  {
    path: 'tabs-lectura',
    loadChildren: () => import('./tabs-lectura/tabs-lectura.module').then( m => m.TabsLecturaPageModule),
    canActivate: [AuthLecturaGuard]
  },

];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
