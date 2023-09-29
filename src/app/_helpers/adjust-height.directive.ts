import { Directive, ElementRef, Renderer2, AfterViewInit } from '@angular/core';

@Directive({
  selector: '[adjustHeight]'
})
export class AdjustHeightDirective implements AfterViewInit {

  constructor(private el: ElementRef, private renderer: Renderer2) {}

  ngAfterViewInit(): void {
    this.adjustHeight();
  }

  private adjustHeight(): void {
    const windowHeight = window.innerHeight;
    const contentHeight = document.body.clientHeight;
    const navPanelHeight = this.el.nativeElement.clientHeight;

    if (contentHeight < windowHeight) {
      this.renderer.setStyle(this.el.nativeElement, 'height', windowHeight - navPanelHeight + 'px');
    }
  }
}