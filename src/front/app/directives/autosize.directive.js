"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require('@angular/core');
var forms_1 = require("@angular/forms");
var Autosize = (function () {
    function Autosize(element, model) {
        this.element = element;
        this.model = model;
    }
    Autosize.prototype.ngOnInit = function () {
        this.adjust(this.model.model);
    };
    Autosize.prototype.onInputChange = function (event) {
        this.adjust(event.target.value);
    };
    Autosize.prototype.adjust = function (value) {
        this.element.nativeElement.value = value;
        this.element.nativeElement.style.overflow = 'hidden';
        this.element.nativeElement.style.height = 'auto';
        this.element.nativeElement.style.height = this.element.nativeElement.scrollHeight + "px";
    };
    Autosize = __decorate([
        core_1.Directive({
            selector: '[ngModel][autosize]',
            providers: [forms_1.NgModel],
            host: {
                '(input)': 'onInputChange($event)'
            }
        }), 
        __metadata('design:paramtypes', [core_1.ElementRef, forms_1.NgModel])
    ], Autosize);
    return Autosize;
}());
exports.Autosize = Autosize;
//# sourceMappingURL=autosize.directive.js.map