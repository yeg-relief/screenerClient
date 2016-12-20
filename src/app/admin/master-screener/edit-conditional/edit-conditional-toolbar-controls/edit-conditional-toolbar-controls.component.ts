import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import * as fromRoot from '../../../reducer';
import * as editQuestion from '../../edit-question/edit-question.actions';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import 'rxjs/add/observable/combineLatest';
import 'rxjs/add/operator/do';



@Component({
  selector: 'app-edit-conditional-toolbar-controls',
  templateUrl: './edit-conditional-toolbar-controls.component.html',
  styleUrls: ['./edit-conditional-toolbar-controls.component.css']
})
export class EditConditionalToolbarControlsComponent implements OnInit, OnDestroy {
  workingEditVersion: number;
  unsavedEdits$: Observable<boolean>;
  originalKey: string;
  handleSaveSubscription: Subscription;
  isSavedSubscription: Subscription;
  constructor(private store: Store<fromRoot.State>, private router: Router, private route: ActivatedRoute) { }

  ngOnInit() {
    this.workingEditVersion = +this.route.snapshot.params['version'];
    this.originalKey = this.route.snapshot.params['key'];
    this.unsavedEdits$ = this.store.let(fromRoot.unsavedQuestionEdits);
    this.isSavedSubscription = this.store.let(fromRoot.questionSaved)
      .subscribe(saved => {
        if(saved){
          this.router.navigateByUrl(`/admin/master-screener/edit/version/${this.workingEditVersion}`)
        }
      })
  }

  handleSave() {
    this.handleSaveSubscription = Observable.combineLatest(
      this.store.let(fromRoot.getPresentQuestionEdit).take(1),
      this.store.let(fromRoot.expandableKey).take(1),
    )
    .subscribe(
      ([presentQuestionState, key]) => {
        this.store.dispatch(new editQuestion.AddConditional({
            questionKey: key,
            conditional: presentQuestionState.question
          })
        );
      },
      (error) => console.log(error)
    );
  }

  ngOnDestroy() {
    if(this.handleSaveSubscription !== undefined && !this.handleSaveSubscription.closed){
      this.handleSaveSubscription.unsubscribe();
    }

    if (!this.isSavedSubscription.closed){
      this.isSavedSubscription.unsubscribe();
    }
  }
}
