import{ 
  Directive, ElementRef, 
  Input, Renderer, OnDestroy,
  Output, EventEmitter, OnInit 
} from '@angular/core';
import {ObservableWrapper} from '@angular/core/src/facade/async';

@Directive({ 
  selector: '[forWidth]'
})
export class ForWidth implements OnDestroy{ 
  globalResize: Function;
  @Output() windowResize: EventEmitter<any> = new EventEmitter<any>(); 

  
  constructor(private el: ElementRef, private renderer: Renderer){}
  
  ngOnInit(){
    this.globalResize = this.renderer
                        .listenGlobal(
                           'window', 
                           'resize', 
                           this.otherFunc(this.windowResize, this.el.nativeElement));

  }
  
  otherFunc(windowResize: EventEmitter<any>, nativeELement){

    return () => {
      const msg = nativeELement
      
      this.windowResize.emit({content: msg});
    }
    
  }
  
  ngOnDestroy(){
    this.globalResize();
    this.windowResize.unsubscribe();
  }
}