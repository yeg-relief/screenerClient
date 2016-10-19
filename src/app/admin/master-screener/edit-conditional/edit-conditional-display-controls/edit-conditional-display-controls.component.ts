import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';

@Component({
  selector: 'app-edit-conditional-display-controls',
  templateUrl: './edit-conditional-display-controls.component.html',
  styleUrls: ['./edit-conditional-display-controls.component.css']
})
export class EditConditionalDisplayControlsComponent implements OnInit {

  @Output() toggleKeys = new EventEmitter<boolean>();
  @Output() toggleControlType = new EventEmitter<boolean>();
  @Output() toggleQuestionType = new EventEmitter<boolean>();
  @Output() toggleLabel = new EventEmitter<boolean>();
  @Output() toggleErrors = new EventEmitter<boolean>();

  @Input() showKeys: boolean;
  @Input() showControlType: boolean;
  @Input() showQuestionType: boolean;
  @Input() showLabel: boolean;
  @Input() showErrors: boolean;

  constructor() { }

  ngOnInit() {
  }

  handleControlTypeToggle($event) {
    this.toggleControlType.emit($event);
  }

  handleQuestionTypeToggle($event) {
    this.toggleQuestionType.emit($event);
  }

  handleLabelToggle($event) {
    this.toggleLabel.emit($event);
  }

  handleKeyToggle($event) {
    this.toggleKeys.emit($event);
  }

  handleDetailsToggle($event) {
    this.toggleErrors.emit($event);
  }
}
