import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { NavController } from '@ionic/angular';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthEspolGuard implements CanActivate {

  constructor(public navCtrl: NavController){ }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

      const guard = sessionStorage.getItem('userGuard');
      if(guard=='espol'){
        return true;
      }else{
        this.navCtrl.navigateRoot('home');
        return false;
      }
  }

}