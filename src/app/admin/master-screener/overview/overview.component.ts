import { Component, OnInit, } from '@angular/core';
import { Subject } from 'rxjs/Subject';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.css'],
})
export class OverviewComponent implements OnInit {
  keyToggle: Subject<boolean>;
  questionToggle: Subject<boolean>;
  constructor() { }

  ngOnInit() {
    this.keyToggle = new Subject<boolean>();
    this.questionToggle = new Subject<boolean>();
    this.keyToggle.next(true);
    this.questionToggle.next(true);
  }

}
