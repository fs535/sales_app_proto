/**
 * Created by SergejFilatov on 12/1/2016.
 */
import {Component, Input} from '@angular/core';
import {Message} from "../../domain/message";

@Component({
    selector: 'msg-box-template',
    template: `
        <div class="message-box" *ngIf="message" [class.error]="message.isError">
            <div class="message-box-header">
                {{ message.isError ? "Error" : "Success"}}
                <button type="button" class="close close-btn" aria-label="Close" (click)="close()">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="message-box-body">
                {{message.text}}
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
}