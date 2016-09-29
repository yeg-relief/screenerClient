import { Injectable } from '@angular/core';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/delay';

@Injectable()
export class AuthService {
  isLoggedIn: boolean = false;

  // store the URL so we can redirect after logging in
  redirectUrl = 'admin/master-screener/overview';

  login(): Observable<boolean> {
    return Observable.of(true).delay(2000).do(val => this.isLoggedIn = val);
  }

  logout(): void {
    this.isLoggedIn = false;
  }
}
