import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConditionEditV2Component } from './condition-edit-v2.component';

describe('ConditionEditV2Component', () => {
  let component: ConditionEditV2Component;
  let fixture: ComponentFixture<ConditionEditV2Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConditionEditV2Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConditionEditV2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
