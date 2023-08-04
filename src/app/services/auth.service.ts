import { Injectable } from '@angular/core';
import { ApiServices } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private api: ApiServices
  ) { }

  crearUsuario(data: any) {
    return this.api.apiCall('admin/crear-usuario', 'POST', data);
  }

  register(data: any) {
    return this.api.authCall('auth/register', 'POST', data);
  }

  login(data: any) {
    return this.api.authCall('auth/login', 'POST', data);
  }

  getLogUser() {
    return this.api.apiCall('auth/get-loguser', 'POST', {});
  }

}
