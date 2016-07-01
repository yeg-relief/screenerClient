import { Component, OnInit } from '@angular/core';
import { DataService, MasterScreener, ExpandableGroup, QuestionGroup  } from '../MasterScreener/index';
import { FormGroup, REACTIVE_FORM_DIRECTIVES, FormControl } from '@angular/forms';
import { toForm, expandableControlMap } from '../MasterScreener/index';
import { GeneralQuestionGroupComponent } from '../question-group/index';

@Component({
  selector: 'master-screener',
  templateUrl:'app/master-screener/master-screener.component.html',
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
          }
        )
  }

  private onSubmit() {
    this.payload = JSON.stringify(this.form.value);
  }
}
