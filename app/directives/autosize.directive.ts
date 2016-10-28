import {ElementRef, HostListener, Directive, Renderer, EventEmitter, Output} from '@angular/core';
import {NgModel} from "@angular/forms";

@Directive({
    selector: '[ngModel][autosize]',
    providers: [NgModel],
    host: {
        '(input)': 'onInputChange($event)'
    }
})
export class Autosize {
    constructor(private element: ElementRef, private model: NgModel) {
    }

    ngOnInit() {
        this.adjust(this.model.model);
    }

    onInputChange(event: any): void {
        this.adjust(event.target.value);
    }

    adjust(value: string): void {
        this.element.nativeElement.value = value;
        this.element.nativeElement.style.overflow = 'hidden';
        this.element.nativeElement.style.height = 'auto';
        this.element.nativeElement.style.height = this.element.nativeElement.scrollHeight + "px";
    }
}
