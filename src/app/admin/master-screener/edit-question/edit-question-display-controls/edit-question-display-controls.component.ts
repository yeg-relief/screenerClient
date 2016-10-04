import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-edit-question-display-controls',
  templateUrl: './edit-question-display-controls.component.html',
  styleUrls: ['./edit-question-display-controls.component.css']
})
export class EditQuestionDisplayControlsComponent implements OnInit {
  @Output() toggleKeys = new EventEmitter<boolean>();
  @Output() toggleControlType = new EventEmitter<boolean>();
  @Output() toggleQuestionType = new EventEmitter<boolean>();
  @Output() toggleExpand = new EventEmitter<boolean>();
  @Output() toggleLabel = new EventEmitter<boolean>();
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

  handleExpandableToggle($event) {
    this.toggleExpand.emit($event);
  }

}
