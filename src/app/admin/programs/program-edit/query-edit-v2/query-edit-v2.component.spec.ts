import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QueryEditV2Component } from './query-edit-v2.component';

describe('QueryEditV2Component', () => {
  let component: QueryEditV2Component;
  let fixture: ComponentFixture<QueryEditV2Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QueryEditV2Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QueryEditV2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
