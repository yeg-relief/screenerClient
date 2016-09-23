/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { MasterScreenerDataService } from './master-screener-data.service';

describe('Service: MasterScreenerData', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MasterScreenerDataService]
    });
  });

  it('should ...', inject([MasterScreenerDataService], (service: MasterScreenerDataService) => {
    expect(service).toBeTruthy();
  }));
});
