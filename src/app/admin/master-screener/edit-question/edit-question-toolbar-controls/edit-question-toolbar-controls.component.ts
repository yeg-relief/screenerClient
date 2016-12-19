import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { Store } from '@ngrx/store';
import * as fromRoot from '../../../reducer';
import * as fromEditQuestion from '../edit-question.actions';
import 'rxjs/add/operator/take';

@Component({
  selector: 'app-edit-question-toolbar-controls',
  templateUrl: './edit-question-toolbar-controls.component.html',
  styleUrls: ['./edit-question-toolbar-controls.component.css']
})
export class EditQuestionToolbarControlsComponent implements OnInit, OnDestroy {
  workingEditVersion: number;
  originalKey: string;
  subscription: Subscription;
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private store: Store<fromRoot.State>
  ) { }

  ngOnInit() {
    this.workingEditVersion = +this.route.snapshot.params['version'];
    this.originalKey = this.route.snapshot.params['key'];
  }

  handleSave() {
    this.subscription = this.store.let(fromRoot.getPresentQuestionEdit).take(1)
      .subscribe(questionState => {
        if (this.originalKey === 'new') {
          this.store.dispatch(new fromEditQuestion.SaveQuestion(questionState.question));
        } else {
          const payload = {
            originalKey: this.originalKey,
            editedVersion: questionState.question
          }
          this.store.dispatch(new fromEditQuestion.UpdateQuestion(payload))
        }
        this.router.navigateByUrl(`/admin/master-screener/edit/version/${this.workingEditVersion}`)
      });
  }

  ngOnDestroy() {
    if(!this.subscription.closed){
      this.subscription.unsubscribe();
    }
  }

}
