import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router'
import { DataService } from '../../data.service';
import 'rxjs/add/operator/do';

@Injectable()
export class KeyResolverService {

  constructor(private data: DataService) {}

  resolve(route: ActivatedRouteSnapshot) {
    console.log(`KeyResolverService.resolve called with route: ${route}`);
    return this.data.getKeys().do(thing => console.log(thing))
  }

}
