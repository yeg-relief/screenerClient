/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { BrowseService } from './browse.service';

describe('Service: Browse', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [BrowseService]
    });
  });

  it('should ...', inject([BrowseService], (service: BrowseService) => {
    expect(service).toBeTruthy();
  }));
});
