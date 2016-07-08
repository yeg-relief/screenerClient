import { Directive, OnInit, OnDestroy, ElementRef, Renderer } from '@angular/core';
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
  globalResize: Function;
  private smallListener;
  private mediumListener;
  private largeListener;
  
  constructor(public store: Store<AppState>, private el: ElementRef, private renderer: Renderer){}
  
  ngOnInit(){
    this.initialMediaWidth();
    
    this.globalResize = this.renderer
                        .listenGlobal(
                           'window', 
                           'resize', 
                           this.otherFunc(this.store, this.el.nativeElement));
  }
  
  // Two different techs for getting window size... which is better?
  
  otherFunc(store: Store<AppState>, nativeELement){
    let x;
    
    
    return () => {
      const left = nativeELement.getBoundingClientRect().left;
      const right = nativeELement.getBoundingClientRect().right;
      const width = right - left;
      if(width < 400 && width >=0){
        if(x != MEDIA_SMALL){
          store.dispatch({type: MediaActions.SET_SIZE, payload: {width: MEDIA_SMALL}})
           x = MEDIA_SMALL;
        }
      } else if(width >= 400 && width <= 900){
        if(x != MEDIA_MEDIUM){
          store.dispatch({type: MediaActions.SET_SIZE, payload: {width: MEDIA_MEDIUM}})
          x = MEDIA_MEDIUM;
        }
      } else if(width > 900){
        if(x != MEDIA_LARGE){
          store.dispatch({type: MediaActions.SET_SIZE, payload: {width: MEDIA_LARGE}})
          x = MEDIA_LARGE;
        }
      }
    }
  }
  
  
  initialMediaWidth(){
    let matched = false;
    
    // multiple matches are found with the class level mediaQueries 
    // these seem to give better results. 
    const initialMediaQueries =  {
      SMALL: "(max-width: 400px)",
      MEDIUM: "(max-width: 900px)",
      LARGE: "(min-width: 900px)"
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
    this.globalResize();
  }
}