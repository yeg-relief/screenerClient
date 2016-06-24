/* tslint:disable:no-unused-variable */

import {
  beforeEach, beforeEachProviders,
  describe, xdescribe,
  expect, it, xit,
  async, inject
} from '@angular/core/testing';
import { DataService } from './data.service';

describe('Data Service', () => {
  beforeEachProviders(() => [DataService]);

  it('should expose a subscribable',
      inject([DataService], (service: DataService) => {
    service.obs.subscribe( x => console.log(x));
  }));
});
