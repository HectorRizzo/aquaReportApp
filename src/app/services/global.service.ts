import { Injectable } from '@angular/core';
import {Subject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GlobalService {

  private refresh = new Subject<any>();

  constructor() { }

  refreshData(data: any) {
    this.refresh.next(data);
  }

  getObservable(): Subject<any> {
    return this.refresh;
  }
}
