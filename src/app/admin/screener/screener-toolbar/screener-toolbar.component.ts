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
  @Output() save = new EventEmitter<any>();
  count = 0;
  updated = 0;

  constructor(public model: ScreenerModel) {

  }

  ngOnInit() {
    const group = {
      keyFilter: new FormControl(''),
      errorFilter: new FormControl(false)
    }

    this.model.count$.asObservable().do(count => console.log(`count: ${count}`) ).subscribe( (count: number) => this.count = count);
    this.model.created$.asObservable().do(count => console.log(`created: ${count}`) ).subscribe( (updated: number) => this.updated = updated);
  }

  handleAdd() {

  }
}
