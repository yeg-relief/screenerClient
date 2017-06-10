import { Component, OnInit, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { ProgramQuery, ProgramCondition } from '../../../models/program';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { FormArray, AbstractControl } from '@angular/forms';
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
  queryForm: FormArray;
  conditionWasChanged = new BehaviorSubject(false);
  private _localConditions: ProgramCondition[];
  timeout;

  constructor(private conditionService: ConditionEditService) { }

  ngOnInit() {
    this._localConditions = this.query.conditions
      .map(mutableCondition => (<any>Object).assign({}, mutableCondition));

    this.queryForm = this.conditionService.condtionsToControls(this._localConditions);
  }

  ngOnChanges(simpleChange) {
    const _conds = simpleChange.query.currentValue.conditions;

    this.queryForm = this.conditionService.condtionsToControls(_conds)
    this._localConditions = _conds;
    this.conditionWasChanged.next(false);
  }

  handleUpdate($event: ProgramCondition){  
    
    if (!$event) return;
    
    let changedConditions: AbstractControl[] = 
      this.queryForm.controls.filter(cond => cond.value.key.name === $event.key.name);

    let changedCondition = changedConditions.length === 1 ? changedConditions[0] : undefined;

    if (!changedCondition) return;

    changedCondition.setValue($event);
    this.conditionWasChanged.next(true);
    this.commitChanges();
    
  }

  commitChanges() {
    const data: ProgramQuery = {
      id: this.query.id,
      guid: this.query.guid,
      conditions: [...this.queryForm.value]
    }

    console.log(data);

    this.update.emit(data);
  }

}
