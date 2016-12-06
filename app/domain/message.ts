/**
 * Created by SergejFilatov on 11/30/2016.
 */
export class Message {
    isError: boolean;
    text: string;
    popUp: boolean;
    data:any;
    performFunc:Function;

    constructor(text:string, isError:boolean = true, popUp:boolean = false, data:any = null, func:Function = null){
        this.text = text;
        this.isError = isError;
        this.popUp = popUp;
        this.data = data;
        this.performFunc = func;
    }

    ok(param:any):any{
        this.performFunc(param);
    }
}
