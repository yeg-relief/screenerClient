import { Component, OnInit } from '@angular/core';
import { FormGroup, REACTIVE_FORM_DIRECTIVES } from '@angular/forms';
import { Store } from '@ngrx/store';
import { AppState } from '../../reducers';
import { GenYcbQuestion, MsControls } from '../../components/index'

import { MD_GRID_LIST_DIRECTIVES } from '@angular2-material/grid-list';
import { MD_CARD_DIRECTIVES } from '@angular2-material/card';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

@Component({
  selector: 'master-screener',
  templateUrl:'app/master-screener/master-screener.component.html',
  styles: [''], 
  directives: [
    MD_GRID_LIST_DIRECTIVES, MD_CARD_DIRECTIVES, 
    GenYcbQuestion, MsControls, 
    REACTIVE_FORM_DIRECTIVES
  ]
})
export class MasterScreenerComponent implements OnInit {
  width$: Observable<any>
  currentQuestion$: Observable<any>
  form$: Observable<any>

  constructor(private store: Store<AppState>) {}
  ngOnInit() {
    this.width$ = this.store.select('media')      
                  .map( (thing:any) => thing.width);
                      
    this.currentQuestion$ = this.store.select('masterScreener')
                            .map( (masterScreener:any) => masterScreener.currentQuestion)
                            
    this.form$ = this.store.select('masterScreener')
                 .map( (masterScreener:any) => masterScreener.data.form)
  }
}
