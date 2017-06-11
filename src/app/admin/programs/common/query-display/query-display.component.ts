import { Component, Input, Output, ChangeDetectionStrategy, EventEmitter, OnChanges } from '@angular/core';
import { ProgramQuery } from '../../../models/program';
@Component({
  selector: 'app-query-display',
  templateUrl: './query-display.component.html',
  styleUrls: ['./query-display.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class QueryDisplayComponent implements OnChanges{
  @Input() query: ProgramQuery;
  @Input() selected: string
  @Output() edit = new EventEmitter();
  @Output() delete = new EventEmitter();
  styleClass = {
    query: true,
    selected: false
  }
  constructor() { }

  ngOnChanges(changes){
    if (changes.selected !== undefined) {
      changes.selected.currentValue === this.query.id ? 
        this.styleClass.selected = true : this.styleClass.selected = false;
    } 
  }

  outputBothEvents() {
    this.delete.emit(this.query.id)
  }
}
