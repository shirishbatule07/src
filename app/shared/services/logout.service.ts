import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LogoutService {
  forceLogout = new Subject<Boolean>();
  constructor() { }

  logout() {
    this.forceLogout.next(true);
  }
}
