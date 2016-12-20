import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Question } from '../../models';

@Component({
  selector: 'app-question',
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.css']
})
export class QuestionComponent implements OnInit {
  @Input() question: Question;
  @Input() conditional: boolean;
  @Input() index: number;
  @Input() length: number;
  @Input() form: FormGroup;
  // when the expandable questions are hidden or expanded
  @Output() onExpand = new EventEmitter<Question[]>();
  @Output() onHide = new EventEmitter<Question[]>();

  expanded = false;

  constructor() { }

  ngOnInit() { }

  handleChange($event) {
    const checked = $event.value;
    if (typeof checked === 'string') {
      if (checked === 'true') {
        this.expand();
      } else {
        this.hide();
      }
      this.expanded = checked === 'true';
    } else if (typeof checked === 'boolean'){
      if (checked === true) {
        this.expand();
      } else {
        this.hide();
      }
      this.expanded = checked;
    }
  }

  expand() {
    console.log('expand called');
    this.onExpand.emit(this.question.conditonalQuestions);
  }

  hide() {
    console.log('hide called');
    this.onHide.emit(this.question.conditonalQuestions);
  }
}
