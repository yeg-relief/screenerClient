import { Injectable } from '@angular/core';
import {Http, Headers, RequestOptions} from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/do';

@Injectable()
export class AuthService {
  isLoggedIn: boolean = false;
  credentials: string;
  // store the URL so we can redirect after logging in
  redirectUrl = 'admin/master-screener/overview';

  constructor(private http: Http){}

  login(user: string, password: string): Observable<boolean> {
    const headers = new Headers();
    headers.append("Authorization", "Basic " + btoa(user + ":" + password));
    const options = new RequestOptions({ headers: headers })

    return this.http.get('/protected/login/', options)
      .map(res => res.json().login)
      .do(success => this.isLoggedIn = success)
      .do(success => {
        if(success) {
          this.credentials = btoa('username:password')
        }
      })
      .do(success => console.log(`succes: ${success}. isLoggedIn: ${this.isLoggedIn}. credentials: ${this.credentials}`))
  }

  logout(): void {
    this.isLoggedIn = false;
    this.credentials = '';
  }
}
