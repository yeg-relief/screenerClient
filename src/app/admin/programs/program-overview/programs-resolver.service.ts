import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router'
import { DataService } from '../../data.service';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/zip';

@Injectable()
export class ProgramsResolverService {

  constructor(private data: DataService) { }

  resolve(route: ActivatedRouteSnapshot) {
    return Observable.zip(this.data.loadPrograms(), this.data.getKeys());
  }

}
