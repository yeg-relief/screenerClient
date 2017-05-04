import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router'
import { MasterScreenerService } from '../master-screener.service';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/observable/of';

@Injectable()
export class QuestionsResolverService {

  constructor(private backend: MasterScreenerService) { }

  resolve(route: ActivatedRouteSnapshot) {
    return this.backend.loadQuestions()
      .switchMap( (data: any) => {
        if (data.questions === undefined || data.conditionalQuestions === undefined) {
          return Observable.throw({error: 'malformed data', data})
        }

        if (!Array.isArray(data.questions)) {
          return Observable.throw({error: 'questions are not an array', data})
        }

        data.questions.sort(this.findAndSort.bind(this))

        data.conditionalQuestions.forEach(this.findAndSort.bind(this))



        return Observable.of(data);
      })
      .catch(err => Observable.of({error: err}));
  }

  findAndSort(q) {
    if(Array.isArray(q.options)) {
      q.options.sort(this.sortOptions);
    }
  }

  sortOptions(a, b) {
    return a - b;
  }
}
