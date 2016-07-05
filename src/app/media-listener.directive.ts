import { Directive, OnInit, OnDestroy, NgZone } from '@angular/core';
import { Store } from '@ngrx/store';
import { MEDIA_SMALL, MEDIA_MEDIUM, MEDIA_LARGE } from './models';
import { AppState } from './reducers';
import { MediaActions } from './actions';

@Directive({ 
  selector: '[media-listener]'
})
export class MediaListener implements OnInit, OnDestroy{ 
  // investigate these breakpoints
  // http://stackoverflow.com/questions/16704243/widths-to-use-in-media-queries
  // https://css-tricks.com/snippets/css/media-queries-for-standard-devices/
  private mediaQueries =  {
    SMALL: "(min-width: 25em)",
    MEDIUM: "(min-width: 33em)",
    LARGE: "(min-width: 40.063em)"
  }
  
  private smallListener;
  private mediumListener;
  private largeListener;
  
  constructor(public store: Store<AppState>, private _ngZone: NgZone){}
  
  ngOnInit(){
    this.initialMediaWidth();
    /*
    this._ngZone.runOutsideAngular( () => {
      this.smallListener = window.matchMedia(this.mediaQueries.SMALL).addListener(
        () => this.store.dispatch({type: MediaActions.SET_SIZE, payload: {width: MEDIA_SMALL}})
      );
      this.mediumListener = window.matchMedia(this.mediaQueries.MEDIUM).addListener(
        () => this.store.dispatch({type: MediaActions.SET_SIZE, payload: {width: MEDIA_MEDIUM}})
      );
      this.largeListener = window.matchMedia(this.mediaQueries.LARGE).addListener(
        () => this.store.dispatch({type: MediaActions.SET_SIZE, payload: {width: MEDIA_LARGE}})
      );
    });*/
  }
  
  initialMediaWidth(){
    let matched = false;
    
    // multiple matches are found with the class level mediaQueries 
    // these seem to give better results. 
    const initialMediaQueries =  {
      SMALL: "(max-width: 25em)",
      MEDIUM: "(max-width: 33em)",
      LARGE: "(min-width: 50.063em)"
    }
    
    const matcher = (keys: string[]) => {
      keys.map( key => {
        const query = window.matchMedia(initialMediaQueries[key]);
        if(query.matches){
          this.store.dispatch({type: MediaActions.SET_SIZE, payload: {width: key}});
          matched = true;
          return;
        }
      })
    } 
    
    // trying to control order of query execution... this seems to give better results 
    matcher(['LARGE', 'MEDIUM', 'SMALL']);
    if(!matched){
      this.store.dispatch({type: MediaActions.SET_SIZE, payload: {width: MEDIA_SMALL}})
    }
  }
  
  ngOnDestroy(){
    /*
    window.matchMedia(this.mediaQueries.SMALL).removeListener(this.smallListener);
    window.matchMedia(this.mediaQueries.MEDIUM).removeListener(this.mediumListener);
    window.matchMedia(this.mediaQueries.LARGE).removeListener(this.largeListener);
    */
  }
}