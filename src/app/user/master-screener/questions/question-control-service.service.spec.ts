/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { QuestionControlServiceService } from './question-control-service.service';

describe('Service: QuestionControlService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [QuestionControlServiceService]
    });
  });

  it('should ...', inject([QuestionControlServiceService], (service: QuestionControlServiceService) => {
    expect(service).toBeTruthy();
  }));
});
