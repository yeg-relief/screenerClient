import { Component, Input, OnInit} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/multicast';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/merge';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { ScreenerModel } from '../screener-model';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-screener-toolbar',
  templateUrl: './screener-toolbar.component.html',
  styleUrls: ['./screener-toolbar.component.css'],
  //changeDetection: ChangeDetectionStrategy.OnPush
})
export class ScreenerToolbarComponent implements OnInit {
  count = 0;
  updated = 0;
  form: any
  private adminControls: FormGroup;
  private allKeys: any[] = [];
  private subscriptions: Subscription[];
  private disabled = false;
  private errors: any =  { error: '' };

  constructor(public model: ScreenerModel) {}

  ngOnInit() {
    const group = {
      keyFilter: new FormControl(''),
      // error filter is disabled for the time being
      errorFilter: new FormControl({value: false, disabled: true})
    }
    this.adminControls = new FormGroup(group);

    this.form = this.model.getModelControls();
    const count = this.model.count$.asObservable().subscribe( (count: number) => this.count = count);
    const created  = this.model.created$.asObservable().subscribe( (updated: number) => this.updated = updated);
    const keys = this.model.keys$.asObservable().subscribe( (allkeys: any[]) => this.allKeys = [...allkeys])

    const errorCheckbox = this.adminControls.valueChanges
      .map( filter => filter.errorFilter )
      .do( filter => this.model.filter$.next(filter) )
      .subscribe();


    const errorSelect = this.adminControls.valueChanges
      .map ( filter => filter.keyFilter)
      .do( filter => this.model.keyFilter$.next(filter) )
      .subscribe();

    this.subscriptions = [ count, created, keys, errorCheckbox, errorSelect ]
  }

  ngOnDestroy() {
    for (const sub of this.subscriptions) {
      if (!sub.closed) {
        sub.unsubscribe();
      }
    }
  }

  handleSave() {
    this.model.save()
      .do(_ => console.error(_))
      .switchMap( data => this.model.pushToNetwork(data) )
      .subscribe( {
        next: data => {
          this.errors.error = '';
          this.model.setModel( data );
          this.model.errors$.next( [] );
        },

        error: err => {
          this.disabled = true;
          this.errors = (<any>Object).assign({}, { error: err })
          setTimeout( () => this.disabled = false, 2000);
          this.model.errors$.next(err);
        }
      } );
  }
}
