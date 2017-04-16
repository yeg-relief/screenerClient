import { async, ComponentFixture, TestBed, getTestBed, ComponentFixtureAutoDetect, inject,  } from '@angular/core/testing';
import { ReflectiveInjector, Injectable, OnDestroy, ModuleWithProviders, DebugElement } from '@angular/core';
import { QuestionEditComponent } from './question-edit.component';
import { MaterialModule } from '@angular/material';
import { ReactiveFormsModule, FormsModule, FormGroup, FormControl, FormBuilder, FormControlName } from '@angular/forms';
import { StoreModule, Store, State, ActionReducer, provideStore, Dispatcher, Action } from '@ngrx/store';
import { Observable, BehaviorSubject } from 'rxjs';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { By } from '@angular/platform-browser';
import * as fromRoot from '../../reducer';
import * as fromScreener from '../store/screener-reducer';
import * as fromKeys from '../../keys/reducer';
import * as fromPrograms from '../../programs/program-overview/reducer';

import { MdInputDirective } from '@angular/material';


@Injectable()
class ActionsSubject extends BehaviorSubject<Action> implements OnDestroy {
  static readonly INIT = '@ngrx/store/init';

  constructor() {
    super({ type: ActionsSubject.INIT });
  }

  next(action: Action): void {
    if (typeof action === 'undefined') {
      throw new Error(`Actions must be objects`);
    }
    else if (typeof action.type === 'undefined') {
      throw new Error(`Actions must have a type property`);
    }

    super.next(action);
  }

  complete() {  }

  ngOnDestroy() {
    super.complete();
  }
}

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




describe('QuestionEditComponent', () => {
  let component: QuestionEditComponent;
  let fixture: ComponentFixture<QuestionEditComponent>;
  let de: DebugElement;
  let el: any;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QuestionEditComponent ],
      imports: [ 
        MaterialModule, 
        ReactiveFormsModule,
        StoreModule.provideStore(fromRoot.reducer, { 
          screener: screenerState, 
          keyOverview: fromKeys.initialState,
          programOverview: fromPrograms.initialState
        }),
        BrowserAnimationsModule
      ],
      providers: [
        FormBuilder,
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuestionEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    
    
    expect(component).toBeTruthy();
  });

  it('should display data representative of questionOne', () => {
    const formControls = fixture.debugElement.queryAll(By.directive(FormControlName))
    
    const label = formControls.find( debugElem => debugElem.attributes.formControlName === 'label');
    expect(label).toBeDefined();
    expect(label.nativeElement.value).toEqual('question label')

    const controlType = formControls.find( debugElem => debugElem.attributes.formControlName === 'controlType');
    expect(controlType).toBeDefined();
    expect(controlType.nativeElement.textContent).toEqual('Input Type  ');

    const expandable = formControls.find( debugElem => debugElem.attributes.formControlName === 'expandable');
    expect(expandable).toBeDefined();
    expect(expandable.nativeElement.getElementsByTagName('input')[0].checked).toEqual(false);

    const name = formControls.find( debugElem => debugElem.attributes.formControlName === 'name' );

    expect(name.nativeElement.textContent.replace(/\s+/g, ''))
      .toEqual('boolean_key:booleaninteger_key:integer')

    expect(name.nativeElement.value).toEqual('boolean_key');
  })
});




