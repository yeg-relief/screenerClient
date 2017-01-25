import { Component, Input, Output, ChangeDetectionStrategy, EventEmitter, OnInit} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/multicast';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/merge';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { ScreenerModel } from '../screener-model';

@Component({
  selector: 'app-screener-toolbar',
  templateUrl: './screener-toolbar.component.html',
  styleUrls: ['./screener-toolbar.component.css'],
  //changeDetection: ChangeDetectionStrategy.OnPush
})
export class ScreenerToolbarComponent implements OnInit {
  @Input() created;
  @Input() count;
  private adminForm: Observable<any>;
  @Output() save = new EventEmitter<any>();
  adminControls: FormGroup;
  valid: boolean;
  allKeys$: Observable<string[]>;

  constructor(public model: ScreenerModel) {

  }

  ngOnInit() {
    const group = {
      keyFilter: new FormControl(''),
      errorFilter: new FormControl(false)
    }

    this.adminControls =  new FormGroup(group);

    this.adminControls.get('errorFilter').valueChanges.map(val => this.model.filterErrors$.next(val)).subscribe();

    this.adminControls.get('keyFilter').valueChanges.map(val => this.model.filterKey$.next(val)).subscribe();

    const keyFilter = this.adminControls.get('keyFilter');
    this.allKeys$ = this.model.state$.map(s => s.keys)

    this.adminForm = this.model.publicform$

  }

  handleAdd() {
    const blank = {
      key: '',
      controlType: '',
      label: '',
      expandable: false
    }

    this.model.addQuestion(blank);
  }
}
