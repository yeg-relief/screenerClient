import { Component, OnInit, Input, ChangeDetectionStrategy } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Question } from '../../../../shared';

@Component({
  selector: 'app-overview-question',
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OverviewQuestionComponent implements OnInit {
  @Input() toggled: BehaviorSubject<boolean>;
  @Input() questions: Question[];
  @Input() error: string;
  constructor() { }
  ngOnInit() {}
}
