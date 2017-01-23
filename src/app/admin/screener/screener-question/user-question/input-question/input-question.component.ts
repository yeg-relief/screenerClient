import { Component, OnInit, Input } from '@angular/core';
import { UserQuestionComponent } from '../user-question.component';
import { FormGroup, FormBuilder } from '@angular/forms'

@Component({
  selector: 'app-input-question',
  templateUrl: './input-question.component.html',
  styleUrls: ['./input-question.component.css']
})
export class InputQuestionComponent extends UserQuestionComponent implements OnInit {
  @Input() adminForm: FormGroup ;
  @Input() question: any;
  private form: FormGroup;
  constructor(private fb: FormBuilder) { 
    super();
  }

  ngOnInit() {
      const group = {}
      group[this.question.key] = [''];
      this.form = this.fb.group(group)

      console.log(this.adminForm);

      console.log('inputquesiton init')
      console.log(this.form);
      this.adminForm.valueChanges
      .subscribe( thing => {
        console.log('from input form');
        console.log(thing);
      })
  }

}
