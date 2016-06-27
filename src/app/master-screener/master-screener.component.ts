import { Component, OnInit } from '@angular/core';
import { DataService, MasterScreener, ExpandableGroup, QuestionGroup  } from '../Screener/index';
import { FormGroup, REACTIVE_FORM_DIRECTIVES, FormControl } from '@angular/forms';
import { toForm, expandableControlMap } from '../Screener/index';
import { GeneralQuestionGroupComponent } from '../question-group/index';

@Component({
  selector: 'master-screener',
  template:` 
  <div>
    <form (ngSubmit)="onSubmit()" [formGroup]="form">
      <div *ngFor="let questionGroup of data.questionGroups" class="form-row">
        <general-question-group 
          [form]="form" 
          [questionGroup]="questionGroup"
          [collapsedControlMap]="collapsedControlMap">
        </general-question-group>
      </div>
      <div class="form-row">
        <button type="submit" [disabled]="!form.valid">Save</button>
      </div>
      
    </form>
    <div *ngIf="payload" class="form-row">
      <strong>Saved the following values</strong><br>{{payload}}
    </div>
  </div>`,
  styles: [''], 
  directives: [REACTIVE_FORM_DIRECTIVES, GeneralQuestionGroupComponent],
  providers:  [DataService]
})
export class MasterScreenerComponent implements OnInit {
  private data: MasterScreener;
  private form: FormGroup;
  private payload: string = '';
  private collapsedControlMap: { [key:string]:{key:string, control:FormControl}[]};


  constructor(private dataService: DataService) {}
  ngOnInit() {
    this.dataService.getMasterScreener()
        .subscribe( 
          (data) => {this.data = data},
          (error) => {console.log(error)},
          () => {
            this.form = toForm(this.data);
            this.collapsedControlMap = expandableControlMap(this.data);
            console.log(this.collapsedControlMap);
          }
        )
  }

  private onSubmit() {
    this.payload = JSON.stringify(this.form.value);
  }
}
