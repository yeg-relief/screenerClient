import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router'
import { DataService } from '../../data.service';

@Injectable()
export class ProgramsResolverService {

  constructor(private data: DataService) { }

  resolve(route: ActivatedRouteSnapshot) {
    return this.data.loadPrograms()
  }

}
