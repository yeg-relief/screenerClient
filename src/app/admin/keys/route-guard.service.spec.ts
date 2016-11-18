/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { KeyRouteGuard } from './route-guard.service';

describe('Service: RouteGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [KeyRouteGuard]
    });
  });

  it('should ...', inject([KeyRouteGuard], (service: KeyRouteGuard) => {
    expect(service).toBeTruthy();
  }));
});
