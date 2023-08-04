import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { NavController } from '@ionic/angular';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NoAuthGuard implements CanActivate {

  constructor(public navCtrl: NavController){ }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

      const guard = sessionStorage.getItem('userGuard');
      if(guard){
        if(guard=='espol'){
          this.navCtrl.navigateRoot('tabs');
        }else if(guard=='personal'){
          this.navCtrl.navigateRoot('tabs-personal');
        }else if(guard=='admin'){
          this.navCtrl.navigateRoot('tabs-admin');
        }
        return false;
      }else{
        return true;
      }

  }

}
