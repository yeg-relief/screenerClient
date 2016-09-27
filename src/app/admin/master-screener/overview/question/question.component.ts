import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';
import { MasterScreenerDataService } from '../../master-screener-data.service';
import { Question } from '../../../../shared';

@Component({
  selector: 'app-question',
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.css']
})
export class QuestionComponent implements OnInit, OnDestroy {
  @Input() toggle: Subject<boolean>;
  toggleSub: Subscription;
  toggled = true;
  questions$: Observable<Question[]>;

  constructor(private data: MasterScreenerDataService) { }

  ngOnInit() {
    this.toggleSub = this.toggle.subscribe(
      (event: boolean) => this.toggled = event,
      (error) => console.log(error)
    );
  }

  ngOnDestroy() {
    this.toggleSub.unsubscribe();
  }
}
