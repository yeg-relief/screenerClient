import { Injectable } from '@angular/core';
import { Http, RequestOptions } from '@angular/http';
import { ProgramCondition, ProgramQuery } from '../../models';
import { ProgramQueryClass } from './program-query.class';
import { AuthService } from '../../core/services/auth.service'
import { Observable } from 'rxjs/Observable';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { QueryEvent} from './index';
@Injectable()
export class QueryService {
  update = Symbol();
  broadcast = new ReplaySubject<QueryEvent>();
  constructor(private http: Http, private authService: AuthService,) {}

  private getCredentials(): RequestOptions {
    return this.authService.getCredentials();
  }



  createOrUpdate(query: ProgramQueryClass, program_guid: string) {
    if (!query.form.valid) return;

    const creds = this.getCredentials();
    creds.headers.append('Content-Type', 'application/json' );
    const data = {
      query: query.form.value,
      guid: program_guid
    };
    const body = JSON.stringify({ data });
    return this.http.post('/protected/query/', body, creds)
      .map(res => res.json())
      .map( ([head, ...tail]) => head)
      .do( res => {
        if (res.created === true || res.result === 'updated') {
          query.conditions = query.conditions.sort( (a, b) => a.data.key.name.localeCompare(b.data.key.name))
          this.broadcast.next({
            id: query.data.id,
            data: query,
            type: this.update
          })
        }
      })
      .catch(this.loadError)
  }

  deleteQuery(query_id: string) {
    const creds = this.getCredentials();
    creds.headers.append( 'Content-Type', 'application/json' );
    return this.http.delete(`/protected/query/${query_id}`, creds)
      .map(res => res.json())
      .map(res => res.found && res.result === 'deleted');
  }

  loadError(error: Response | any) {
    let errMsg: string;
    if (error instanceof Response) {
      const body = error.json() || '';
      const err = body['message'] || JSON.stringify(body);
      errMsg = err;
    } else {
      errMsg = error.message ? error.message : error.toString();
    }
    return Observable.throw(errMsg);
  }
}
