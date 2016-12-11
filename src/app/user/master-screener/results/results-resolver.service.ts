import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router'
import { MasterScreenerService } from '../master-screener.service';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class ResultsResolverService {

  constructor(private masterScreenerService: MasterScreenerService) { }

  resolve(route: ActivatedRouteSnapshot) {
    return this.masterScreenerService.results;
  }
}
