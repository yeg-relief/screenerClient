import { Component, OnInit, Input } from '@angular/core';
import { Key } from '../../../models/key'
import { ProgramConditionClass } from '../../services/program-condition.class';
import { ProgramModelService } from '../../services/program-model.service'
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-condition-edit-v3',
  templateUrl: './condition-edit-v3.component.html',
  styleUrls: ['./condition-edit-v3.component.css']
})
export class ConditionEditV3Component implements OnInit {
  @Input() condition: ProgramConditionClass;
  keys: Observable<Key[]>;
  readonly qualifiers = [
    {
      display: '>', value: 'greaterThan'
    },
    {
      display: '>=', value: 'greaterThanOrEqual'
    },
    {
      display: '=', value: 'equal'
    },
    {
      display: '<=', value: 'lessThanOrEqual'
    },
    {
      display: '<', value: 'lessThan'
    }
  ];


  constructor(private ps: ProgramModelService) { }

  ngOnInit() {
    this.keys = this.ps.keys.map(keys => keys.sort( (a, b) => a.name.localeCompare(b.name)) );
  }


  isKeySelected(name: string): boolean {
    return name === this._getSelectedKeyName();
  }

  private _getSelectedKeyName(): string {
    return this.condition.form.value.key.name;
  }

  handleKeyChange($event) {
    const booleanValueStrategy = form => form.get('value').setValue(true)

    const numberValueStrategy = form => {
      form.get('value').setValue(0);
      form.get('qualifier').setValue('lessThanOrEqual');
    }

    const name = $event.target.value;
    this.keys.take(1).map(keys => keys.find(k => k.name === name)).subscribe(key => {
      if (key){
        this.condition.form.get('key').setValue(key);
        this.condition.form.get('type').setValue(key.type);

        if (key.type === 'boolean')
          booleanValueStrategy(this.condition.form);
        else 
          numberValueStrategy(this.condition.form);
      }
    });
  }

  getKeyType(): string {
    return this.condition.form.value.key.type;
  }

  isQualifierSelected(qualifierValue: string) { 
    const bleh = this.getKeyType() !== 'boolean' && 
           this.condition.form.get('qualifier').value === qualifierValue;

    return bleh;
  }

}
