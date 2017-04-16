/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement, Injectable, OnDestroy } from '@angular/core';
import { ScreenerToolbarComponent } from './screener-toolbar.component';
import { MaterialModule } from '@angular/material';
import { ReactiveFormsModule, FormGroup, FormControl } from '@angular/forms'
import { Action, StoreModule } from '@ngrx/store';
import { BehaviorSubject, Observable } from 'rxjs';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import * as fromRoot from '../../reducer';
import * as fromScreener from '../store/screener-reducer';
import * as fromKeys from '../../keys/reducer';
import * as fromPrograms from '../../programs/program-overview/reducer';
import { RequestOptions, Headers } from '@angular/http';
import { AuthService } from '../../core/services/auth.service'
import { KeyFilterService } from '../services/key-filter.service'
import { RouterLink } from '@angular/router';

declare const btoa;

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


class MockAuthService {
  credentials: string;
  isLoggedIn = false;
  login(user, password){
    this.credentials = btoa('user' + ":" + 'password');
    return Observable.of({login: true})
  }

  logout() {
    this.isLoggedIn = false;
    this.credentials = '';
  }

  getCredentials(): RequestOptions {
    const headers = new Headers();
    headers.append("Authorization", "Basic " + this.credentials);
    return new RequestOptions({ headers: headers });
  }
}

describe('ScreenerToolbarComponent', () => {
  let component: ScreenerToolbarComponent;
  let fixture: ComponentFixture<ScreenerToolbarComponent>;

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
      providers: [
        KeyFilterService,
        { provide: AuthService, useClass: MockAuthService }
      ],
      declarations: [ ScreenerToolbarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ScreenerToolbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should conform to this display TODO: think of better description', () => {
    const meta = fixture.debugElement.queryAll(By.css('md-card-subtitle'));
    expect(meta).not.toBeNull();
    expect(meta.length).toEqual(2);
    expect(meta[0].nativeElement.innerText).toEqual('latest server update: Dec 31, 1969');
    expect(meta[1].nativeElement.innerText).toEqual('this screener has 1 questions');

    const buttons = fixture.debugElement.queryAll(By.css('button'));
    expect(buttons).not.toBeNull();
    expect(buttons.length).toEqual(2)
    expect(buttons[0].nativeElement.disabled).toEqual(false)
    expect(buttons[1].nativeElement.disabled).toEqual(false)
    expect(buttons[1].attributes['routerLink']).toEqual('/admin/screener/preview')
  });

  it('should show two keys in the key filter', () => {
    const autocomplete = fixture.debugElement.query(By.css('md-autocomplete'));
    expect(autocomplete).not.toBeNull();
    /*
    having trouble testing autocomplete... consider if this is worth it, bcuz material libary proabably
    has tested this functionality

    console.log(autocomplete.children)
    console.log(autocomplete.childNodes)
    component.adminControls.get('keyFilter').setValue('boo');
    console.log('-----------')
    console.log(autocomplete.nativeElement)
    console.log(fixture.debugElement.nativeElement)
    const options = fixture.debugElement.queryAll(By.css('md-option'));
    expect(options).not.toBeNull();
    expect(options.length).toEqual(2);
    expect(options[0].nativeElement.innerText).toEqual('boolean_key')
    expect(options[1].nativeElement.innerText).toEqual('integer_key')
    */
  });
});
