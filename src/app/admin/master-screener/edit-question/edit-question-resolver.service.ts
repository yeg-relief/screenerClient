import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router'
import { DataService } from '../../data.service';
import { Store } from '@ngrx/store';
import * as fromRoot from '../../reducer';
import * as fromEditQuestion from './edit-question.actions';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of'
import 'rxjs/add/observable/throw'
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/filter';

import { cloneDeep } from 'lodash';
import { Question } from '../../../shared/models/question';
import { MasterScreener } from '../../models/master-screener';

@Injectable()
export class EditQuestionResolverService {

  constructor(
    private data: DataService,
    private store: Store<fromRoot.State>
  ) { }

  resolve(route: ActivatedRouteSnapshot) {
    const keyParam = route.params['key'];
    const versionParam = +route.params['version'];
    console.log(versionParam);
    if (keyParam === 'new') {
      return this.newQuestion();
    }
    return this.findQuestion(keyParam, versionParam);
  }

  findQuestion(keyParam, versionParam) {
    return this.data.loadScreener(versionParam)
      .map(screener => screener.questions)
      .switchMap(x => x)
      // kind of gross...
      .filter(question => {
        if (question.key === keyParam) {
          return true;
        } else if (question.expandable) {
          return question.conditonalQuestions.findIndex(q => q.key === keyParam) > -1;
        }
        return false;
      })
      // add a reduce incase multiple questions are found??? 
      // shouldn't be the case... DEFINITELY should not -- will break backend
      .map(question => cloneDeep(question))
      .catch(() => Observable.throw('question not found!'))
  }

  newQuestion() {
    let newQuestion: Question = {
      type: undefined,
      label: undefined,
      expandable: false,
      conditonalQuestions: [],
      options: [],
      key: 'empty',
      controlType: undefined
    };

    return Observable.of(newQuestion);
  }
}