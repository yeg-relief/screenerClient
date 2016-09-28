import { Component, OnInit, Input, ChangeDetectionStrategy } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';


@Component({
  selector: 'app-key',
  templateUrl: './key.component.html',
  styleUrls: ['./key.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class KeyComponent implements OnInit {
  @Input() toggled: BehaviorSubject<boolean>;
  @Input() keys: Array<any>;
  constructor() { }
  ngOnInit() {}
}
