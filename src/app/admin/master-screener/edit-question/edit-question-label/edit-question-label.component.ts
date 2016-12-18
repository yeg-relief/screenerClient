import { Component, Input } from '@angular/core';


@Component({
  selector: 'app-edit-question-label',
  templateUrl: './edit-question-label.component.html',
  styleUrls: ['./edit-question-label.component.css']
})
export class EditQuestionLabelComponent {
  @Input() label: string;
  internalLabel: string;

  saveInput($event) {
    this.internalLabel = $event;
  }

  changeLabel() {
    this.label = this.internalLabel;
  }
}
