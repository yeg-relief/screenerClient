import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';


type Question = any;

@Component({
  selector: 'app-checkbox-question',
  templateUrl: './checkbox-question.component.html',
  styleUrls: ['./checkbox-question.component.css']
})
export class CheckboxQuestionComponent implements OnInit {
  @Input() adminForm: FormGroup ;
  @Input() question: any;
  private form: FormGroup;
  private section: FormGroup;


  constructor(private fb: FormBuilder) {

   }

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
