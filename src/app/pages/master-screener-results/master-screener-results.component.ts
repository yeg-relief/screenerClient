import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../../reducers';
import { ResultComponent } from '../../components/index';
import { MasterScreenerActions } from '../../actions/index';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

@Component({
  selector: 'master-screener-results',
  templateUrl:'app/pages/master-screener-results/master-screener-results.component.html',
  styles: [''], 
  directives: [ResultComponent]
})
export class MasterScreenerResultsComponent implements OnInit{
  width$: Observable<any>;
  results$: Observable<any>;
  
  constructor(private store: Store<AppState>) {}
  
  ngOnInit(){
    this.store.dispatch({type: MasterScreenerActions.SUBMIT});
    
    this.width$ = this.store.select('media')      
                  .map( (thing:any) => thing.width)
                  
    this.results$ = this.store.select('masterScreener')
                    .map( (masterScreener:any) => masterScreener.results)
  }
}