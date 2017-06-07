import { Component, Input, Output, ChangeDetectionStrategy, EventEmitter } from '@angular/core';
import { ProgramQuery } from '../../../models/program';
@Component({
  selector: 'app-query-display',
  templateUrl: './query-display.component.html',
  styleUrls: ['./query-display.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class QueryDisplayComponent {
  @Input() query: ProgramQuery;
  @Output() edit = new EventEmitter();
  @Output() delete = new EventEmitter();
  constructor() { }
}
