import { Component, OnInit, Input } from '@angular/core';
import { Subject } from 'rxjs/Subject';

@Component({
  selector: 'app-controls',
  templateUrl: './controls.component.html',
  styleUrls: ['./controls.component.css']
})
export class ControlsComponent implements OnInit {
  @Input() keyToggle: Subject<boolean>;
  @Input() questionToggle: Subject<boolean>;

  constructor() { }

  ngOnInit() {
  }

  keyChange(change) {
    this.keyToggle.next(change);
  }

  questionChange(change) {
    this.questionToggle.next(change);
  }
}
