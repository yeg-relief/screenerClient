import{ 
  Directive, ElementRef, 
  Input, Renderer, OnDestroy,
  Output, EventEmitter, OnInit 
} from '@angular/core';

import { Store } from '@ngrx/store';
import { SMALL, MEDIUM, LARGE } from './reducers';


@Directive({ 
  selector: '[media-listener]'
})
export class MediaListener implements OnDestroy, OnInit{ 
  
  private mediaQueries =  {
    SMALL: "(max-width: 40em)",
    MEDIUM: "(min-width: 40.063em)",
    LARGE: "(min-width: 64.063em)"
  }

  @Output() 
  mediaListener: EventEmitter<string> = new EventEmitter<string>(); 
  
  constructor(public store: Store<any>){}
  
  ngOnInit(){
    this.initialMediaWidth();
    window.matchMedia(this.mediaQueries.SMALL).addListener( () => this.store.dispatch({type: SMALL}));
    window.matchMedia(this.mediaQueries.MEDIUM).addListener( () => this.store.dispatch({type: MEDIUM}));
    window.matchMedia(this.mediaQueries.LARGE).addListener( () => this.store.dispatch({type: LARGE}));
  }
  
  initialMediaWidth(){
    Object.keys(this.mediaQueries).map( key => {
      const matchObject = window.matchMedia(this.mediaQueries[key]);
      if(matchObject.matches){
        this.store.dispatch({type: key});
      }
    })
  }
  
  
  
  ngOnDestroy(){
    this.mediaListener.unsubscribe();
  }
  
  
  
  
  /*
  
  
  ngOnInit(){
    // right - left
    const initWidth: number =   this.el.nativeElement.getBoundingClientRect().right  
                              - this.el.nativeElement.getBoundingClientRect().left;
                              
    this.windowInit.emit({width: initWidth, message:"from init"});
    
    this.windowInit.complete();
    
    this.globalResize = this.renderer
                        .listenGlobal(
                           'window', 
                           'resize', 
                           this.otherFunc(this.windowResize, this.el.nativeElement));
   

  }
  
  otherFunc(windowResize: EventEmitter<any>, nativeELement){

    return () => {
      const left = nativeELement.getBoundingClientRect().left;
      const right = nativeELement.getBoundingClientRect().right;
      const width = right - left;
      this.windowResize.emit({width: width, message: "from resize"});
    }
    
  }
  
  ngOnDestroy(){
    this.globalResize();
    this.windowResize.unsubscribe();
    this.windowInit.unsubscribe();
  }
  */
}