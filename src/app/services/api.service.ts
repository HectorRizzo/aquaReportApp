/* eslint-disable @typescript-eslint/naming-convention */
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpHeaders, HttpClient, HttpRequest, HttpEvent } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';
import { GlobalService } from './global.service';

@Injectable()

export class ApiServices {

    dataUser: any;
    URL_API = environment.apiUrl;
    /* url = environment.Url; */
    URI: string = environment.baseUrl;

    constructor(private http: HttpClient,
         private cookies: CookieService,
         private route: Router,
         private global: GlobalService,
    ) { }

    public apiCall(endpoint, method, data) {
        this.dataUser = JSON.parse(sessionStorage.getItem('dataUser'));
        data.token = this.getToken();
        data.user_id = this.dataUser?this.dataUser.id:0;
        const headers = new HttpHeaders({ 'Content-Type': 'application/json',
            Authorization: `Bearer ${data.token}`
        });
        switch (method) {
            case 'GET':
                return this.http.get(`${this.URL_API}${endpoint}`, {responseType: 'json'});
            case 'POST':
                // eslint-disable-next-line object-shorthand
                return this.http.post(`${this.URL_API}${endpoint}`, data, { headers: headers });
        }
    }

    public authCall(endpoint, method, data) {
        const headers = new HttpHeaders({ 'Content-Type': 'application/json'});
        switch (method) {
            case 'GET':
                return this.http.get(`${this.URL_API}${endpoint}`, {responseType: 'json'});
            case 'POST':
                return this.http.post(`${this.URL_API}${endpoint}`, data, { headers });
        }
    }

    public setToken(token: any) {
        this.cookies.set('token', token);
    }

    public getToken() {
        return this.cookies.get('token');
    }

    public logout() {
        this.global.refreshData(true);
        this.cookies.delete('token');
        sessionStorage.clear();
        this.route.navigate(['/home']);
        // this.route.navigate(['/login']);
    }

}
