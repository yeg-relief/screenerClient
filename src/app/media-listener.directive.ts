import{ Directive, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { MEDIA_SMALL, MEDIA_MEDIUM, MEDIA_LARGE } from './models';
import { AppState } from './reducers';

@Directive({ 
  selector: '[media-listener]'
})
export class MediaListener implements  OnInit{ 
  
  private mediaQueries =  {
    MEDIA_SMALL: "(max-width: 350px)",
    MEDIA_MEDIUM: "(max-width: 650px)",
    MEDIA_LARGE: "(min-width: 1200px)"
  }
  
  constructor(public store: Store<AppState>){}
  
  ngOnInit(){
    this.initialMediaWidth();
    //these listeners are only created once and are only destroyed when window is destroyed... need to unsub?
    window.matchMedia(this.mediaQueries.MEDIA_SMALL).addListener( () => this.store.dispatch({type: MEDIA_SMALL}));
    window.matchMedia(this.mediaQueries.MEDIA_MEDIUM).addListener( () => this.store.dispatch({type: MEDIA_MEDIUM}));
    window.matchMedia(this.mediaQueries.MEDIA_LARGE).addListener( () => this.store.dispatch({type: MEDIA_LARGE}));
  }
  
  initialMediaWidth(){
    const matcher = ():boolean => {
      for(const key in this.mediaQueries){
        const query = window.matchMedia(this.mediaQueries[key]);
        if(query.matches){
          this.store.dispatch({type: key});
          return true;
        }
      }
      return false;
    }
    
    if(!matcher()){
      this.store.dispatch({type: MEDIA_SMALL})
    }
  }
}