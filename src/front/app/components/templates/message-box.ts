/**
 * Created by SergejFilatov on 12/1/2016.
 */
import {Component, Input, Output, EventEmitter} from '@angular/core';
import {Message} from "../../domain/message";

@Component({
    selector: 'msg-box-template',
    template: `
        <div class="message-box" *ngIf="message" [class.error]="message.isError" [class.popup]="message.popUp">
            <div class="message-box-header">
                {{ message.isError ? "Error" : message.popUp ? "Confirmation" : "Success"}}
                <button type="button" class="close close-btn" aria-label="Close" (click)="close()">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="message-box-body">
                {{message.text}}
            </div>
            <div *ngIf="message.popUp" class="message-box-footer">
                <button class="btn btn-default okCancelBtn" (click)="ok()">Ok</button>
                <button class="btn btn-default okCancelBtn" (click)="cancel()">Cancel</button>
            </div>
        </div>
    `
})
export class MessageBox {
    @Input() message:Message;

    constructor() {}

    close():void{
        this.message = null;
    }

    ok():void{
        let response = this.message.data;
        this.message.ok(response);
        this.message = null;
    }

    cancel():void{
        this.message = null;
    }


}