import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Key } from '../../models';
import { AuthService } from '../../core/services/auth.service';
import * as fromRoot from '../../reducer';
import * as actions  from '../store/screener-actions';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/merge';
import 'rxjs/add/operator/do';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { KeyFilterService } from '../services/key-filter.service';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-screener-toolbar',
  templateUrl: './screener-toolbar.component.html',
  styleUrls: ['./screener-toolbar.component.css'],
})
export class ScreenerToolbarComponent implements OnInit {
  private count$: Observable<number>;
  private adminControls: FormGroup;
  private allKeys$: Observable<Key[]>;
  private form$: Observable<FormGroup>;
  private created$: Observable<number>;
  private subscriptions: Subscription[];
  private disabled = false;
  private errors: any =  { error: '' };



  constructor(private store: Store<fromRoot.State>, private keyFilter: KeyFilterService) {}

  ngOnInit() {
    const group = { keyFilter: new FormControl('') };
    this.adminControls = new FormGroup(group);

    this.allKeys$ = 
      this.adminControls.get('keyFilter').valueChanges
        .map( (filterItem) => filterItem.name !== undefined? filterItem.name : filterItem )
        .withLatestFrom(this.store.let(fromRoot.getScreenerKeys))
        .map( ([filterInput, _, ]) => [_, new RegExp(<string>filterInput, 'gi')])
        .map( ([keys, filterRegex]) => (<Key[]>keys).filter(key => (<RegExp>filterRegex).test(key.name)) )
        .do ( keys => this.keyFilter.setValue(keys.map(k => k.name)))
        .startWith(this.adminControls.get('keyFilter').value)

    this.form$ = this.store.let(fromRoot.getForm);
    this.count$ = this.store.let(fromRoot.getConstantQuestions).map(questions => questions.length);
    this.created$ = this.store.select('screener', 'created');
  }

  displayFunction(key: Key){
    return key ? key.name : key;
  }

  ngOnDestroy() {
    for (const sub of this.subscriptions) {
      if (!sub.closed) {
        sub.unsubscribe();
      }
    }
  }

  handleSave() {
   
  }
}
