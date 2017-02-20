import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-conditional-questions',
  templateUrl: './conditional-questions.component.html',
  styleUrls: ['./conditional-questions.component.css']
})
export class ConditionalQuestionsComponent implements OnInit {
  @Input() questions: any[];
  @Output() removeConditional = new EventEmitter<any>();
  //@Input() form: FormGroup;
  //private questionControl: FormGroup;
  private selectedQuestion: any[] = [];
  private styles = {};
  constructor() { }

  ngOnInit() {
    for(const question of this.questions) {
      this.styles[question.id] = {
        selected: false
      }
    }
  }

  selectQuestion(question) {
    this.selectedQuestion = [question];
    const selected = Object.keys(this.styles).filter(key => this.styles[key].selected = true)
    for(const key of selected) {
      this.styles[key].selected = false;
    }
    if (this.styles[question.id]){
      this.styles[question.id].selected = true;
    } else {
      this.styles[question.id] = {
        selected: true
      }
    }
  }

  deleteConditionalQuestion(selectedQuestion) {
    this.questions = this.questions.filter(question => question.id !== selectedQuestion.id);
    this.removeConditional.emit(selectedQuestion[0]);
    this.selectedQuestion = [];
    const selected = Object.keys(this.styles).filter(key => this.styles[key].selected = true)
    for(const key of selected) {
      this.styles[key].selected = false;
    }
  }

  updateOverview(question, $event) {
    const qq = question[0];
    let updateQuestion;
    if (qq) {
      updateQuestion = this.questions.find(q => q.id === qq.id);
    }
    if (updateQuestion) {
      updateQuestion.key = $event;
    }
  }
}
