import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ScreenerContainerComponent } from './screener-container.component';

describe('ScreenerContainerComponent', () => {
  let component: ScreenerContainerComponent;
  let fixture: ComponentFixture<ScreenerContainerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ScreenerContainerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ScreenerContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
