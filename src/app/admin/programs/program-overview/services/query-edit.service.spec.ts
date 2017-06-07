import { TestBed, inject } from '@angular/core/testing';

import { QueryEditService } from './query-edit.service';

describe('QueryEditService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [QueryEditService]
    });
  });

  it('should be created', inject([QueryEditService], (service: QueryEditService) => {
    expect(service).toBeTruthy();
  }));
});
