import { Component, OnInit, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { ProgramQuery, ProgramCondition } from '../../../models/program';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { FormArray } from '@angular/forms';
import { ConditionEditService } from '../../program-overview/services/condition-edit.service';

@Component({
  selector: 'app-query-edit-v2',
  templateUrl: './query-edit-v2.component.html',
  styleUrls: ['./query-edit-v2.component.css'],
  providers: [ ConditionEditService ]
  //changeDetection: ChangeDetectionStrategy.OnPush
})
export class QueryEditV2Component implements OnInit {
  @Input() query: ProgramQuery;
  @Output() update = new EventEmitter<ProgramQuery>();
  conditionForms: FormArray;
  conditionWasChanged = new BehaviorSubject(false);
  private _localConditions: ProgramCondition[];

  constructor(private conditionService: ConditionEditService) { }

  ngOnInit() {
    this._localConditions = this.query.conditions
      .map(mutableCondition => (<any>Object).assign({}, mutableCondition));

    this.conditionForms = this.conditionService.condtionsToControls(this._localConditions);

    console.log(this.conditionForms)
  }

  ngOnChanges(simpleChange) {
    const _conds = simpleChange.query.currentValue.conditions;

    this.conditionForms = this.conditionService.condtionsToControls(_conds)
    this._localConditions = _conds;
  }

  handleUpdate($event: ProgramCondition){  
    if (!$event) return;
    
    let changedCondition = this._localConditions.find(condition => condition.key.name === $event.key.name);

    if (!changedCondition) return;

    changedCondition = (<any>Object).assign({}, $event);
    this.conditionWasChanged.next(true);
  }

  commitChanges() {
    const data: ProgramQuery = {
      id: this.query.id,
      guid: this.query.guid,
      conditions: [...this._localConditions]
    }

    this.update.emit(data);
  }

}
