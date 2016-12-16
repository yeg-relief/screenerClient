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
import 'rxjs/add/operator/do';

@Injectable()
export class BrowseService {
  programs$;

  constructor(private http: Http) {
    this.programs$ =  this.http.get('/api/programs')
                        .map(res => res.json().programs)
                        // ensure that only one http call is made with mulitple subscriptions to this obs
                        .multicast( new ReplaySubject(1)).refCount()
                        .catch(this.loadError);
   }

  getCategories(): Promise<string[]> {
    return this.programs$
            // flatten programs
            .switchMap(x => x)
            .do(program => console.log(program))
            .pluck('value', 'tags')
            .reduce( (allTags, programTags) => {
              return allTags.concat(programTags);
            }, [])
            .toPromise()
            .catch( Observable.throw('error getting categories'));
  }

  // at this point we're just grabbing all programs... naive but okay at this stage of app
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
