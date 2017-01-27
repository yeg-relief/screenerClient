import { Component, OnInit } from '@angular/core';
import { ScreenerModel } from '../screener-model';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/take';
import { cloneDeep } from 'lodash';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { QuestionControlService } from
  '../../../user/master-screener/questions/question-control.service';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/let';
import 'rxjs/add/operator/multicast';
import 'rxjs/add/observable/merge';
import 'rxjs/add/observable/zip';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { Subscription } from 'rxjs/Subscription';


@Component({
  selector: 'app-screener-overview',
  templateUrl: './screener-overview.component.html',
  styleUrls: ['./screener-overview.component.css'],
  providers: [ QuestionControlService ]
})
export class ScreenerOverviewComponent implements OnInit {
  questions: any[]
  subscriptions: Subscription[];
  constructor(public model: ScreenerModel, private qcs: QuestionControlService, private fb: FormBuilder) { }

  ngOnInit() {
    // small bootstrap...
    const bootstrap = this.model.load().subscribe(data => console.log(data));
    
    const questions = this.model.questions$.subscribe( (questions: any[]) => this.questions = [...questions])
  
    this.subscriptions = [bootstrap, questions];
  }

  ngOnDestroy() {
    for(const sub of this.subscriptions) {
      if (!sub.closed){
        sub.unsubscribe();
      }
    }
  }

}
