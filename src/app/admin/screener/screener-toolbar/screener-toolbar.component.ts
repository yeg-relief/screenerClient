import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/merge';
import 'rxjs/add/operator/do';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-screener-toolbar',
  templateUrl: './screener-toolbar.component.html',
  styleUrls: ['./screener-toolbar.component.css'],
})
export class ScreenerToolbarComponent implements OnInit {
  count = 0;
  updated = 0;
  private adminControls: FormGroup;
  private allKeys: any[] = [];
  private subscriptions: Subscription[];
  private disabled = false;
  private errors: any =  { error: '' };


  @Output() onFilter = new EventEmitter<string>();
  constructor() {}

  ngOnInit() {
    const group = { keyFilter: new FormControl('') };
    this.adminControls = new FormGroup(group);
/*
    const count = this.controller.state$.map(state => state.questions.length).subscribe(val => this.count = val);

    const created  = this.controller.state$.map(state => state.created).subscribe( (updated: number) => this.updated = updated);
    
    const keys = this.controller.state$.asObservable()
      .map(state => state.keys)
      .subscribe( (allkeys: any[]) => this.allKeys = [...allkeys])
*/

    const keySelect = this.adminControls.valueChanges
      .map ( filter => filter.keyFilter)
      .subscribe(val => val === 'all' ? this.onFilter.emit('') : this.onFilter.emit(val) );

    //this.subscriptions = [ count, created, keys, keySelect ]
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
