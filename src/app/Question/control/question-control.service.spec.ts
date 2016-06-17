/* tslint:disable:no-unused-variable */

import {
  beforeEach, beforeEachProviders,
  describe, xdescribe,
  expect, it, xit,
  async, inject
} from '@angular/core/testing';
import { QuestionControlService } from './question-control.service';

describe('QuestionControl Service', () => {
  beforeEachProviders(() => [QuestionControlService]);

  it('should ...',
      inject([QuestionControlService], (service: QuestionControlService) => {
    expect(service).toBeTruthy();
  }));
});
