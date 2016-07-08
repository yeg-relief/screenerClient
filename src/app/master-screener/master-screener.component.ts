import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState, getCurrentQuestion } from '../reducers';
import { YcbQuestion } from '../components/question'

import { MD_GRID_LIST_DIRECTIVES } from '@angular2-material/grid-list';
import { MD_CARD_DIRECTIVES } from '@angular2-material/card';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

@Component({
  selector: 'master-screener',
  templateUrl:'app/master-screener/master-screener.component.html',
  styles: [''], 
  directives: [MD_GRID_LIST_DIRECTIVES, MD_CARD_DIRECTIVES, YcbQuestion]
})
export class MasterScreenerComponent implements OnInit {
  width$: Observable<any>
  currentQuestion$: Observable<any>

  constructor(private store: Store<AppState>) {}
  ngOnInit() {
    this.width$ = this.store.select('media')      
                  .map( (thing:any) => thing.width);
                      
    this.currentQuestion$ = this.store.select('masterScreener')
                            .map( (masterScreener:any) => masterScreener.currentQuestion)
  }
}
