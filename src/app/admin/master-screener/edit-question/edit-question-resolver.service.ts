import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router'
import { DataService } from '../../data.service';
import { Store } from '@ngrx/store';
import * as fromRoot from '../../reducer';
import * as fromEditQuestion from './edit-question.actions';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/from'
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/take';

@Injectable()
export class EditQuestionResolverService {

  constructor(
    private data: DataService,
    private store: Store<fromRoot.State>
  ) {}

  resolve(route: ActivatedRouteSnapshot) {
    const key = route.params['key'];
    return Observable.of(key)
            .do(key => this.store.dispatch(new fromEditQuestion.EditQuestionInit({originalQuestionKey: key, expandableQuestionKey: ''})))
            .switchMap( () => this.store.let(fromRoot.findEditQuestion))
            .take(1)
            .toPromise()
  }

}
