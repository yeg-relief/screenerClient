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

  @Output() 
  windowResize: EventEmitter<any> = new EventEmitter<any>(); 

  @Output()
  windowInit: EventEmitter<any> = new EventEmitter<any>();
  
  constructor(private el: ElementRef, private renderer: Renderer){}
  
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
}