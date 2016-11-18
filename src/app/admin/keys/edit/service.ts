import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { DataService } from '../../data.service';
import { Store } from '@ngrx/store';
import * as fromRoot from '../../reducer';
import { Key } from '../../models/key';
import 'rxjs/add/operator/take';

@Injectable()
export class KeyEditService implements CanActivate {

  constructor(private store: Store<fromRoot.State>, private service: DataService) { }

  updateKey(key: Key) {
    return this.service.updateKey(key).take(1);
  }
  // implement if needed
  canActivate(): boolean {
    return true;
  }
}
