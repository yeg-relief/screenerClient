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
    return keyParam;
  }
}