import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { Key } from '../../models/key';
import { Store } from '@ngrx/store';
import * as keysActions from '../actions';
import * as fromRoot from '../../reducer';
import { KeyEditService } from './service';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/withLatestFrom';
import 'rxjs/add/operator/scan';
import 'rxjs/add/operator/takeUntil';
import 'rxjs/add/operator/map';
import { Subject } from 'rxjs/Subject';

/*
 for now we will only focus on making new keys and not editing existing keys. 
 ie, we *edit* a new empty key.
*/
@Component({
  selector: 'app-key-edit',
  templateUrl: './key-edit.component.html',
  styleUrls: ['./key-edit.component.css']
})
export class KeyEditComponent implements OnInit, OnDestroy {
  keys$: Observable<Key[]>;
  destroy$ = new Subject();
  typeOptions = [
    'number',
    'boolean'
  ];
  uniqueKeyName = false;

  nameControl = new FormControl(
    '',
    Validators.compose(
      [
        Validators.required,
        Validators.pattern('[a-z]+_?[a-z]+?')
      ]
    )
  );
  typeControl = new FormControl(this.typeOptions[0]);
  form = new FormGroup({
    name: this.nameControl,
    type: this.typeControl
  });

  constructor(
    private store: Store<fromRoot.State>,
    private service: KeyEditService,
    private router: Router
  ) { }

  ngOnInit() {
    this.keys$ = this.store.let(fromRoot.allLoadedKeys).takeUntil(this.destroy$);
    const form$ = this.form.valueChanges;

    form$
      .withLatestFrom(this.keys$)
      .scan( (accum, [form, keys]) => {
        return keys.filter(programKey => programKey.name === form.name);
      }, [])
      // if array is empty then there are no duplicates => return true
      .map(duplicateKeys => duplicateKeys.length === 0)
      .takeUntil(this.destroy$)
      .subscribe(
        (noDuplicate) => this.uniqueKeyName = noDuplicate,
        (err) => console.log(err),
        () => console.log('completed')
      );
  }

  ngOnDestroy() {
    this.destroy$.next();
  }

  dispatchKeyUpdate() {
    const key: Key = {
      name: this.form.value.name,
      type: this.form.value.type
    };
    this.store.dispatch(new keysActions._UpdateKey(key));
    this.service.updateKey(key).subscribe({
      complete: () => this.router.navigateByUrl('/admin/keys/overview')
    });
  }
}

