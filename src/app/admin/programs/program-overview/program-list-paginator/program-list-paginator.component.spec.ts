import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProgramListPaginatorComponent } from './program-list-paginator.component';

describe('ProgramListPaginatorComponent', () => {
  let component: ProgramListPaginatorComponent;
  let fixture: ComponentFixture<ProgramListPaginatorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProgramListPaginatorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProgramListPaginatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
