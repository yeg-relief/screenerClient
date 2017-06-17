import { Component, Input, Output, ChangeDetectionStrategy, EventEmitter, OnChanges, OnInit } from '@angular/core';
import { ProgramQueryClass } from '../../services/program-query.class';
import { ProgramQuery } from '../../../models'
@Component({
  selector: 'app-query-display',
  templateUrl: './query-display.component.html',
  styleUrls: ['./query-display.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class QueryDisplayComponent implements OnChanges, OnInit {
  @Input() query: ProgramQuery;
  @Input() selected: ProgramQueryClass
  @Output() edit = new EventEmitter();
  @Output() delete = new EventEmitter();
  styleClass = {
    query: true,
    selected: false
  }
  constructor() { }

  ngOnChanges(changes){
    if (changes && changes.selected !== undefined && changes.selected.currentValue !== undefined) {
      changes.selected.currentValue.data.id === this.query.id ? 
        this.styleClass.selected = true : this.styleClass.selected = false;
    } 
  }

  ngOnInit() {
    this.query.conditions.sort( (a, b) => a.key.name.localeCompare(b.key.name) )
  }

  outputBothEvents() {
    this.delete.emit(this.query)
  }
}
