import { TestBed, inject } from '@angular/core/testing';

import { ConditionEditService } from './condition-edit.service';

describe('ConditionEditService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ConditionEditService]
    });
  });

  it('should be created', inject([ConditionEditService], (service: ConditionEditService) => {
    expect(service).toBeTruthy();
  }));
});
