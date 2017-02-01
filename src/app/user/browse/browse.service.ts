import { Injectable } from '@angular/core';
import { UserFacingProgram } from '../../shared';
import { Observable } from 'rxjs/Observable';
import { Http, Response } from '@angular/http';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/pluck';
import 'rxjs/add/operator/reduce';
import 'rxjs/add/operator/multicast';
import 'rxjs/add/operator/toArray';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';


@Injectable()
export class BrowseService {
  programs$;

  constructor(private http: Http) {
    this.programs$ =  this.http.get('/api/programs')
                        .map(res => res.json().programs)
                        .map(wrappedValues => wrappedValues.map( wrapped => wrapped.value) )
                        .do(programs => console.log(programs))
                        // ensure that only one http call is made with mulitple subscriptions to this obs
                        .multicast( new ReplaySubject(1) ).refCount()
                        .catch(this.loadError);
   }

  getCategories(): Promise<string[]> {
    return this.programs$
            // flatten programs
            .switchMap(x => x)
            .pluck('tags')
            .reduce( (allTags, programTags) => {
              programTags.forEach(tag => {
                if (allTags.indexOf(tag) < 0) {
                  allTags.push(tag);
                }
              })
              return allTags;
            }, [])
            .toPromise()
            .catch( Observable.throw('error getting categories'));
  }

  getAllPrograms()  {
    return this.programs$.toPromise();
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
