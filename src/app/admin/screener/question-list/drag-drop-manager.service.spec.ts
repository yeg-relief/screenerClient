import { TestBed, inject } from '@angular/core/testing';

import { DragDropManagerService } from './drag-drop-manager.service';

describe('DragDropManagerService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DragDropManagerService]
    });
  });

  it('should ...', inject([DragDropManagerService], (service: DragDropManagerService) => {
    expect(service).toBeTruthy();
  }));
});
