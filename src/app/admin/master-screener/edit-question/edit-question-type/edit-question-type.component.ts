import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Question } from '../../../../shared/models';
import { Key } from '../../../models/key';

@Component({
  selector: 'app-edit-question-type',
  templateUrl: './edit-question-type.component.html',
  styleUrls: ['./edit-question-type.component.css']
})
export class EditQuestionTypeComponent{
  @Output() booleanSelected = new EventEmitter<boolean>();
  @Input() type: string;
  private options = [
    {display: 'true/false', value: 'boolean'},
    {display: 'number', value: 'number'},
    {display: 'text', value: 'text'}
  ];

  dispatchChange(newValue) {
    this.type = newValue;
    if(newValue === 'boolean'){
      this.booleanSelected.emit(true);
    } else {
      this.booleanSelected.emit(false);
    }
  }
}
