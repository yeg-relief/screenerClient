import { Component, OnInit, Input, ChangeDetectionStrategy } from '@angular/core';
import { Subject } from 'rxjs/Subject';

@Component({
  selector: 'app-controls',
  templateUrl: './controls.component.html',
  styleUrls: ['./controls.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ControlsComponent implements OnInit {
  @Input() keyToggle: Subject<boolean>;
  @Input() questionToggle: Subject<boolean>;
  @Input() versions: number[];
  @Input() workingVersion: number;
  @Input() loading: boolean;
  @Input() error: string;

  constructor() { }

  ngOnInit() {}

  keyChange(change) {
    this.keyToggle.next(change);
  }

  questionChange(change) {
    this.questionToggle.next(change);
  }

  isSelected(version: number) {
    return version === this.workingVersion;
  }
}
