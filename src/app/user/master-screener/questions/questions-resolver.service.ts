import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router'
import { MasterScreenerService } from '../master-screener.service';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class QuestionsResolverService {

  constructor(private backend: MasterScreenerService) { }

  resolve(route: ActivatedRouteSnapshot) {
    return this.backend.loadQuestions().catch(err => Observable.of(JSON.parse(err)));
  }
}
