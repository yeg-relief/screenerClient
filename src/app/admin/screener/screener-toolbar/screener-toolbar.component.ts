import { Component, Input, Output, ChangeDetectionStrategy, EventEmitter, OnInit} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/multicast';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/merge';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Component({
  selector: 'app-screener-toolbar',
  templateUrl: './screener-toolbar.component.html',
  styleUrls: ['./screener-toolbar.component.css'],
  //changeDetection: ChangeDetectionStrategy.OnPush
})
export class ScreenerToolbarComponent implements OnInit {
  @Input() created;
  @Input() count;
  @Input() adminForm: FormGroup;
  @Output() filter = new EventEmitter<string>();
  @Output() save = new EventEmitter<any>();
  valid: Observable<boolean>;

  ngOnInit() {
    this.valid = this.adminForm.valueChanges.multicast(new BehaviorSubject(false)).refCount(); 
  }
}
