import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { ConditionEditService } from '../../program-overview/services/condition-edit.service';
import { ProgramCondition } from '../../../models'
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-new-condition',
  templateUrl: './new-condition.component.html',
  styleUrls: ['./new-condition.component.css']
})
export class NewConditionComponent implements OnInit {
  @Output() save = new EventEmitter<ProgramCondition>();
  form: FormGroup;
  condition: ProgramCondition;
  canSave = false;
  timeout;
  constructor(private conditionService: ConditionEditService) { }

  ngOnInit() {
    this.form = this.conditionService.blankConditionControl();
    this.condition = this.form.value;
  }

  handleUpdate($event) {
    clearTimeout(this.timeout);

    if (this.form.valid) {
      this.timeout = setTimeout(() => this.canSave = true, 300);
    } else {
      this.canSave = false;
    }

    
		
    
  }

  handleSave(){

    const val: ProgramCondition = Object.assign({}, this.form.value);
    this.save.emit(val);

    //this.form = this.conditionService.blankConditionControl();
    //this.condition = this.form.value;
  }
}
