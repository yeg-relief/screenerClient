import { Component, OnInit, Input } from '@angular/core';
import { UserQuestionComponent } from '../user-question.component';
import { FormGroup, FormBuilder } from '@angular/forms'

@Component({
  selector: 'app-input-question',
  templateUrl: './input-question.component.html',
  styleUrls: ['./input-question.component.css']
})
export class InputQuestionComponent  implements OnInit {
  @Input() adminForm: FormGroup ;
  @Input() question: any;
  private income: FormGroup;
  private form: FormGroup;
  constructor(private fb: FormBuilder) { }

  ngOnInit() {
      this.adminForm.valueChanges
        .map(state => state[this.question.key])
        .map(question => <any>Object.assign({}, question))
        .subscribe(update => this.question = update);
      const group = {}
      group[this.question.key] = [''];
      this.form = this.fb.group(group);
  }

}
