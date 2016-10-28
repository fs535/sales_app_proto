'use strict';

import {Component, Input, OnDestroy} from '@angular/core';

@Component({
    selector: 'my-spinner',
    template: `<div [hidden]="!isDelayedRunning" class="spinner">
    <div class="double-bounce1"></div>
    <div class="double-bounce2"></div>
    </div>`
})
export class SpinnerComponent implements OnDestroy {
    private currentTimeout: number;
    private isDelayedRunning: boolean = false;

    @Input()
    public delay: number = 300;

    @Input()
    public set isRunning(value: boolean) {
        if (!value) {
            this.cancelTimeout();
            this.isDelayedRunning = false;
            return;
        }

        if (this.currentTimeout) {
            return;
        }

        this.currentTimeout = core.setTimeout(() => {
            this.isDelayedRunning = value;
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