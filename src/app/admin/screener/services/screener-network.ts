import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Injectable } from '@angular/core';
import { AuthService } from '../../core/services/auth.service'
import { Observable } from 'rxjs/Observable';

@Injectable()
export class ScreenerNetwork {
  constructor(private http: Http, private authService: AuthService) {}

  private getCredentials(): Headers {
    if (this.authService.credentials === undefined) {
      throw new Error('undefined credentials in data service');
    }
    const headers = new Headers();
    headers.append("Authorization", "Basic " + this.authService.credentials);
    return headers;
  }

  push(data): Observable<Response>  {
    const headers = this.getCredentials()
    headers.append('Content-Type', 'application/json');
    const options = new RequestOptions({ headers: headers });
    return Observable.of(data)
      .map(screener => JSON.stringify({ screener: screener }))
      .switchMap(body => this.http.post('/protected/screener', body, options))
      .map(response => response.json().response)
      .timeout(30000);
  }

  pull(): Observable<Response>  {
    const headers = this.getCredentials()
    const options = new RequestOptions({ headers: headers });
    return this.http.get('/protected/screener', options)
      .map(res => res.json().response)
      .retry(2)
      .timeout(50000)
  }
}