import { ElementRef } from '@angular/core';
export declare class Autosize {
    element: ElementRef;
    onInput(textArea: HTMLTextAreaElement): void;
    constructor(element: ElementRef);
    ngOnInit(): void;
    adjust(): void;
}
