import { Directive, ElementRef, Input, HostListener, Renderer, OnDestroy  } from '@angular/core';

@Directive({ selector: '[forWidth]' })
export class ForWidth implements OnDestroy{ 
  globalResize: Function;
  
  constructor(private el: ElementRef, private renderer: Renderer){
    this.globalResize = this.renderer.listenGlobal('window', 'resize', () => console.log('resize'))
  }
  
  ngOnDestroy(){
    this.globalResize();
    console.log(this.globalResize);
  }
}