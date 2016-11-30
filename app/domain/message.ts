/**
 * Created by SergejFilatov on 11/30/2016.
 */
export class Message {
    isError: boolean;
    text: string;
    constructor(text:string, isError:boolean = true){
        this.text = text;
        this.isError = isError;
    }
}
