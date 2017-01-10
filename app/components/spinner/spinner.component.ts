'use strict';

import {Component, Input, Output, OnDestroy} from '@angular/core';

@Component({
    selector: 'my-spinner',
    template: `<div [hidden]="!isDelayedRunning" class="spinner">
    <div class="double-bounce1"></div>
    <div class="double-bounce2"></div>
    </div>`
})
export class SpinnerComponent implements OnDestroy {
    private currentTimeout: any;
    private isDelayedRunning: boolean = false;
    @Output()
    public isAppRunning: boolean = false;

    @Input()
    public delay: number = 300;

    @Input()
    public set isRunning(value: boolean) {

        if (!value) {
            this.cancelTimeout();
            this.isDelayedRunning = false;
            this.isAppRunning = value;
            return;
        }

        if (this.currentTimeout) {
            return;
        }

        this.currentTimeout = setTimeout(() => {
            this.isDelayedRunning = value;
            this.isAppRunning = value;
            this.cancelTimeout();
        }, this.delay);
    }

    private cancelTimeout(): void {
        clearTimeout(this.currentTimeout);
        this.currentTimeout = undefined;
    }

    ngOnDestroy(): any {
        this.cancelTimeout();
    }
}