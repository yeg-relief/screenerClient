import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ScreenerPreviewComponent } from './screener-preview.component';

describe('ScreenerPreviewComponent', () => {
  let component: ScreenerPreviewComponent;
  let fixture: ComponentFixture<ScreenerPreviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ScreenerPreviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ScreenerPreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
