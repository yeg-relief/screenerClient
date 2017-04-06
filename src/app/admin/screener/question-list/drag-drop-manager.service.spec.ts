import { TestBed, inject } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';
import { DragDropManagerService } from './drag-drop-manager.service';

describe('DragDropManagerService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DragDropManagerService, FormBuilder]
    });
  });

  it('should ...', inject([DragDropManagerService], (service: DragDropManagerService) => {
    expect(service).toBeTruthy();
  }));
});
