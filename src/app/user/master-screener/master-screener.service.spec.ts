/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { MasterScreenerService } from './master-screener.service';

describe('Service: MasterScreener', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MasterScreenerService]
    });
  });

  it('should ...', inject([MasterScreenerService], (service: MasterScreenerService) => {
    expect(service).toBeTruthy();
  }));
});
