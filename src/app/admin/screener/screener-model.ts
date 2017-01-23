import { Injectable, OnDestroy } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { Subscription } from 'rxjs/Subscription';
import { Subject } from 'rxjs/Subject';
import { AuthService } from '../core/services/auth.service'
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/retry';
import 'rxjs/add/operator/timeout';
import 'rxjs/add/operator/multicast';
import 'rxjs/add/operator/scan';
import 'rxjs/add/operator/merge';

type Screener = any;

@Injectable()
export class ScreenerModel implements OnDestroy{
  state$: Observable<Screener>
  dispatch: Subject<Screener>
  private subscription: Subscription;
  constructor(private http: Http, private authService: AuthService){
    this.dispatch = new Subject<Screener>()
    this.state$ = this.dispatch
      .scan( (state, screener) => (<any>Object).assign({}, screener), {})
      .do(screener => console.log(screener))
      .multicast( new ReplaySubject(1)).refCount()

    this.subscription = this.state$.subscribe();
  }

  ngOnDestroy(){
    if (!this.subscription.closed){
      this.subscription.unsubscribe()
    }
  }

  private getCredentials(): Headers{
    if (this.authService.credentials === undefined) {
      throw new Error('undefined credentials in data service');
    }
    const headers = new Headers();
    headers.append("Authorization", "Basic " + this.authService.credentials);
    return headers;
  }


  save() {
    const headers = this.getCredentials()
    headers.append('Content-Type', 'application/json' );
    const options = new RequestOptions({ headers: headers });
    return this.state$
      .map(screener => JSON.stringify({ screener: screener}))
      .switchMap(body => this.http.post('/protected/screener', body, options))
      .map(response => response.json().screener)
      .do( screener => this.dispatch.next(screener) )
      .catch ( this.loadError )
      .retry(2)
      .timeout(5000)
      
   }

  load() {
    const headers = this.getCredentials()
    const options = new RequestOptions({ headers: headers });
    return this.http.get('/protected/screener', options)
      .map(res => res.json().response)
      .do( screener => this.dispatch.next(screener) )
      .catch( this.loadError )
      .retry(2)
      .timeout(5000)
  }

  loadError(error: Response | any) {
    let errMsg: string;
    if (error instanceof Response) {
      const body = error.json() || '';
      const err = body.message || JSON.stringify(body);
      errMsg = err;
    } else {
      errMsg = error.message ? error.message : error.toString();
    }
    console.error(errMsg);
    return Observable.throw(errMsg);
  }
}
