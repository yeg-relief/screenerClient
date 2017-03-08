import { TestBed, inject } from '@angular/core/testing';

import { KeyFilterService } from './key-filter.service';

describe('KeyFilterService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [KeyFilterService]
    });
  });

  it('should ...', inject([KeyFilterService], (service: KeyFilterService) => {
    expect(service).toBeTruthy();
  }));
});
