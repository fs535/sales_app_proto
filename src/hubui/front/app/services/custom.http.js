"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var http_1 = require("@angular/http");
var core_1 = require("@angular/core");
require('rxjs/add/operator/finally');
var CustomHttp = (function (_super) {
    __extends(CustomHttp, _super);
    function CustomHttp(backend, defaultOptions) {
        _super.call(this, backend, defaultOptions);
    }
    Object.defineProperty(CustomHttp.prototype, "isRunning", {
        get: function () {
            return CustomHttp.isRunning;
        },
        enumerable: true,
        configurable: true
    });
    CustomHttp.prototype.request = function (url, options) {
        CustomHttp.isRunning = true;
        return _super.prototype.request.call(this, url, options).finally(function () {
            CustomHttp.isRunning = false;
        });
    };
    CustomHttp.prototype.get = function (url, options) {
        CustomHttp.isRunning = true;
        return _super.prototype.get.call(this, url, options).finally(function () {
            CustomHttp.isRunning = false;
        });
    };
    CustomHttp.prototype.post = function (url, body, options) {
        CustomHttp.isRunning = true;
        return _super.prototype.post.call(this, url, body, options).finally(function () {
            CustomHttp.isRunning = false;
        });
    };
    CustomHttp.prototype.put = function (url, body, options) {
        CustomHttp.isRunning = true;
        return _super.prototype.put.call(this, url, body, options).finally(function () {
            CustomHttp.isRunning = false;
        });
    };
    CustomHttp.prototype.delete = function (url, options) {
        CustomHttp.isRunning = true;
        return _super.prototype.delete.call(this, url, options).finally(function () {
            CustomHttp.isRunning = false;
        });
    };
    CustomHttp.prototype.patch = function (url, body, options) {
        CustomHttp.isRunning = true;
        return _super.prototype.patch.call(this, url, body, options).finally(function () {
            CustomHttp.isRunning = false;
        });
    };
    CustomHttp.prototype.head = function (url, options) {
        CustomHttp.isRunning = true;
        return _super.prototype.head.call(this, url, options).finally(function () {
            CustomHttp.isRunning = false;
        });
    };
    CustomHttp.prototype.options = function (url, options) {
        CustomHttp.isRunning = true;
        return _super.prototype.options.call(this, url, options).finally(function () {
            CustomHttp.isRunning = false;
        });
    };
    CustomHttp.isRunning = false;
    CustomHttp = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [http_1.ConnectionBackend, http_1.RequestOptions])
    ], CustomHttp);
    return CustomHttp;
}(http_1.Http));
exports.CustomHttp = CustomHttp;
//# sourceMappingURL=custom.http.js.map