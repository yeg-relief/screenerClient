import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { YcbQuestionComponent } from '../../../user/master-screener/ycb-question/ycb-question.component';
import { By } from '@angular/platform-browser';
import { 
  YcbConditionalQuestionComponent 
} from '../../../user/master-screener/ycb-question/ycb-conditional-question/ycb-conditional-question.component';
import { DebugElement, Injectable, OnDestroy } from '@angular/core';
import { ScreenerPreviewComponent } from './screener-preview.component';
import { MaterialModule } from '@angular/material';
import { ReactiveFormsModule, FormGroup, FormControl } from '@angular/forms'
import { Action, StoreModule } from '@ngrx/store';
import { BehaviorSubject, Observable } from 'rxjs';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import * as fromRoot from '../../reducer';
import * as fromScreener from '../store/screener-reducer';
import * as fromKeys from '../../keys/reducer';
import * as fromPrograms from '../../programs/program-overview/reducer';


const questionOne = new FormGroup({
  key: new FormGroup({
    name: new FormControl('boolean_key'),
    type: new FormControl('boolean')
  }),
  label: new FormControl('question label'),
  controlType: new FormControl('CheckBox'),
  id: new FormControl('fake_id'),
  index: new FormControl(0),
  options: new FormControl([]),
  conditionalQuestions: new FormControl([]),
  expandable: new FormControl(false)
})

const form = new FormGroup({})
form.addControl('fake_id', questionOne);


const screenerState: fromScreener.State  = {
  loading: false,
  form: form,
  error: '',
  selectedConstantQuestion: 'fake_id',
  selectedConditionalQuestion: undefined,
  keys: [
    {name: 'boolean_key', type: 'boolean'},
    {name: 'integer_key', type: 'integer'}
  ],
  created: 0
}

describe('ScreenerPreviewComponent', () => {
  let component: ScreenerPreviewComponent;
  let fixture: ComponentFixture<ScreenerPreviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        MaterialModule, 
        ReactiveFormsModule,
        StoreModule.provideStore(fromRoot.reducer, { 
          screener: screenerState, 
          keyOverview: fromKeys.initialState,
          programOverview: fromPrograms.initialState
        })
      ],
      declarations: [ ScreenerPreviewComponent, YcbQuestionComponent, YcbConditionalQuestionComponent ]
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

  it('should show a single constant question', () => {
    const questionsContainer = fixture.debugElement.query(By.css('.questions'))
    expect(questionsContainer).not.toBeNull();
    const questions = questionsContainer.queryAll(By.css('app-ycb-question'));
    expect(questions.length).toEqual(1);
  })
});
