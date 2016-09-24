import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/of';

@Injectable()
export class LocationService {
  constructor(private router: Router) { }

  getUrl(): Observable<string[]> {
    return Observable.of(this.router.routerState.snapshot.url)
      .map((url: string) => url.split('/').splice(2));
  }
}
