import { async, ComponentFixture, TestBed, getTestBed, ComponentFixtureAutoDetect, inject,  } from '@angular/core/testing';
import { ReflectiveInjector, Injectable, OnDestroy } from '@angular/core';
import { QuestionEditComponent } from './question-edit.component';
import { MaterialModule } from '@angular/material';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { StoreModule, Store, State, ActionReducer, provideStore, Dispatcher, Action } from '@ngrx/store';
import { Observable, BehaviorSubject } from 'rxjs';
import * as fromRoot from '../../reducer';

//const store: Store<fromRoot.State> = new Store(new Dispatcher(), fromRoot.reducer, )

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

  complete() { /* noop */ }

  ngOnDestroy() {
    super.complete();
  }
}



describe('QuestionEditComponent', () => {
  let component: QuestionEditComponent;
  let fixture: ComponentFixture<QuestionEditComponent>;
  let injector: ReflectiveInjector;
  let store: Store<fromRoot.State>;
  let dispatcher: any;
  let initialState: any;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QuestionEditComponent ],
      imports: [ 
        MaterialModule, 
        ReactiveFormsModule,
        StoreModule.provideStore(fromRoot.reducer)
      ],
      providers: [
        //{ provide: Store, useClass: MockStore }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuestionEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  // inject([Router], (router: Router) => {
  it('should create', inject([Store], (store: Store<fromRoot.State>) => {
    expect(component).toBeTruthy();
  }));
});



