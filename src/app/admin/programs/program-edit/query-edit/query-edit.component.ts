import { Component, OnInit, Input, OnDestroy, Output, EventEmitter } from '@angular/core';
import { ProgramQuery, ProgramCondition } from '../../../models/program';

@Component({
  selector: 'app-query-edit',
  templateUrl: './query-edit.component.html',
  styleUrls: ['./query-edit.component.css']
})
export class QueryEditComponent {
  @Input() query: ProgramQuery;
  @Output() save = new EventEmitter<ProgramQuery>();
  @Output() cancel = new EventEmitter();
  editCondition$ = new EventEmitter<ProgramQuery>();
  constructor() { }

  ngOnInit() {}

  handleDelete(condition) {
    this.query.conditions = this.query.conditions.filter( c => c.key.name !== condition.key.name )
  }

  handleEdit(condition) {
    this.editCondition$.emit(condition);
  }

  handleSaveCondition($event) {
    this.query.conditions = this.query.conditions.filter(c => c.key.name !== $event.key.name).concat($event);
  }
}