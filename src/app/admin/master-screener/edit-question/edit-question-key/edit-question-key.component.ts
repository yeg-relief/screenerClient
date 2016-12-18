import { Component, Input } from '@angular/core';
import { Key } from '../../../models/key';


@Component({
  selector: 'app-edit-question-key',
  templateUrl: './edit-question-key.component.html',
  styleUrls: ['./edit-question-key.component.css']
})
export class EditQuestionKeyComponent {
  @Input() unusedKeys: Key[];
  @Input() currentKey: string;

  selectChange(value) {
    this.currentKey = value;
  }

  isSelected(key: string) {
    return key === this.currentKey;
  }

  isEmpty() {
    return this.currentKey === 'empty';
  }
}
