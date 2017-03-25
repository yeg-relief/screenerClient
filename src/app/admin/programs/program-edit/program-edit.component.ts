import { Component, OnInit, OnDestroy } from '@angular/core';
import { ApplicationFacingProgram, ProgramQuery } from '../../models/program';
import { Key } from '../../models/key';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { FormControl, Validators, FormGroup, FormBuilder } from '@angular/forms';
import { Store } from '@ngrx/store';
import * as fromRoot from '../../reducer';
import * as fromOverview from '../program-overview/actions';
import { ActivatedRoute } from '@angular/router';

@Component({
  templateUrl: './program-edit.component.html',
  styleUrls: ['./program-edit.component.css']
})
export class ProgramEditComponent implements OnInit, OnDestroy {
 
  // emit in OnDestroy to unsubscribe 'main' observable
  destroy$ = new Subject<boolean>();

  saving$ = new BehaviorSubject<boolean>(false);
  // controls if user is editing the title, description etc or adding queries 
  view = new FormControl('user');
  views = ['user', 'application'];
  view$ = this.view.valueChanges.multicast(new Subject()).refCount();
  
  form: FormGroup;


  hide = false;

  constructor(
    private store: Store<fromRoot.State>, 
    private fb: FormBuilder,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    const guid = this.route.snapshot.params['guid'];
    
    fromRoot.findProgram(this.store, guid)
      .take(1)
      .subscribe( program => {
        this.form = this.fb.group({
          user: this.fb.group({
            title: new FormControl(program.user.title, [Validators.required]),
            details: new FormControl(program.user.details, Validators.required),
            link: new FormControl(program.user.externalLink),
            tags: new FormControl([]),
            tag: new FormControl(''),
            guid: new FormControl(program.guid)
          }),
          application: new FormControl(program.application),
          guid: new FormControl(guid, Validators.required)
        })
      })
    
    this.view$
      .takeUntil(this.destroy$)
      .subscribe({
        next: view => {
          if (view !== 'application') {
            setTimeout( () => this.hide = false, 0);
          } else {
            setTimeout( () => this.hide = true, 0);
          }
        }
      });
  }

  ngOnDestroy() {
    this.destroy$.next(true);
  }

  removeTag(tag) {
    const tagsControl = this.form.get('tags');
    tagsControl.setValue(tagsControl.value.filter(t => t !== tag))
  }

  addTag() {
    this.form.get('tags').setValue([...this.form.get('tags').value, this.form.get('tag').value]);
    this.form.get('tag').setValue('');
  }

  submit() {
    this.saving$.next(true);
    if (this.form.get('guid').value === 'new') {
      this.store.dispatch(new fromOverview.CreateProgram(this.form.value));
    } else {
      this.store.dispatch(new fromOverview.UpdateProgram(this.form.value));
    }
  }

  addQuery(queries) {
    this.form.get('application').setValue([...this.form.get('application').value, ...queries])
  }
}

