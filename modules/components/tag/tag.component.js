var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component, Input, Output, EventEmitter, TemplateRef, ElementRef, Renderer, HostListener, ViewChild } from '@angular/core';
var KeyboardEvent = global.KeyboardEvent;
import { TagRipple } from './tag-ripple.component';
var TagComponent = (function () {
    function TagComponent(element, renderer) {
        this.element = element;
        this.renderer = renderer;
        this.onSelect = new EventEmitter();
        this.onRemove = new EventEmitter();
        this.onBlur = new EventEmitter();
        this.onKeyDown = new EventEmitter();
        this.onTagEdited = new EventEmitter();
        this.editModeActivated = false;
        this.rippleState = 'none';
    }
    TagComponent.prototype.select = function ($event) {
        if (this.readonly) {
            return;
        }
        if ($event) {
            $event.stopPropagation();
        }
        this.focus();
        this.onSelect.emit(this.model);
    };
    TagComponent.prototype.remove = function () {
        this.onRemove.emit(this);
    };
    TagComponent.prototype.focus = function () {
        this.renderer.invokeElementMethod(this.element.nativeElement, 'focus');
    };
    TagComponent.prototype.keydown = function (event) {
        if (this.editModeActivated) {
            event.keyCode === 13 ? this.disableEditMode(event) : this.storeNewValue();
            return;
        }
        this.onKeyDown.emit({ event: event, model: this.model });
    };
    TagComponent.prototype.blink = function () {
        var classList = this.element.nativeElement.classList;
        classList.add('blink');
        setTimeout(function () { return classList.remove('blink'); }, 50);
    };
    TagComponent.prototype.toggleEditMode = function (event) {
        if (this.editModeActivated) {
            this.storeNewValue();
        }
        else {
            this.element.nativeElement.querySelector('[contenteditable]').focus();
        }
        this.editModeActivated = !this.editModeActivated;
        this.renderer.setElementClass(this.element.nativeElement, 'tag--editing', this.editModeActivated);
    };
    TagComponent.prototype.getDisplayValue = function (item) {
        return typeof item === 'string' ? item : item[this.displayBy];
    };
    TagComponent.prototype.getContentEditableText = function () {
        return this.element.nativeElement.querySelector('[contenteditable]').innerText.trim();
    };
    TagComponent.prototype.disableEditMode = function ($event) {
        this.editModeActivated = false;
        $event.preventDefault();
    };
    TagComponent.prototype.storeNewValue = function () {
        var _this = this;
        var input = this.getContentEditableText();
        var exists = function (model) {
            return typeof model === 'string' ?
                model === input :
                model[_this.identifyBy] === input;
        };
        if (exists(this.model)) {
            var itemValue = this.model[this.identifyBy];
            this.model = typeof this.model === 'string' ? input : (_a = {}, _a[this.identifyBy] = itemValue, _a[this.displayBy] = itemValue, _a);
            this.onTagEdited.emit(this.model);
        }
        var _a;
    };
    TagComponent.prototype.isDeleteIconVisible = function () {
        return !this.readonly && this.removable && !this.editModeActivated;
    };
    TagComponent.prototype.isRippleVisible = function () {
        return !this.readonly && !this.editModeActivated;
    };
    return TagComponent;
}());
__decorate([
    Input(),
    __metadata("design:type", Object)
], TagComponent.prototype, "model", void 0);
__decorate([
    Input(),
    __metadata("design:type", Boolean)
], TagComponent.prototype, "readonly", void 0);
__decorate([
    Input(),
    __metadata("design:type", Boolean)
], TagComponent.prototype, "removable", void 0);
__decorate([
    Input(),
    __metadata("design:type", Boolean)
], TagComponent.prototype, "editable", void 0);
__decorate([
    Input(),
    __metadata("design:type", TemplateRef)
], TagComponent.prototype, "template", void 0);
__decorate([
    Input(),
    __metadata("design:type", String)
], TagComponent.prototype, "displayBy", void 0);
__decorate([
    Input(),
    __metadata("design:type", String)
], TagComponent.prototype, "identifyBy", void 0);
__decorate([
    Input(),
    __metadata("design:type", Number)
], TagComponent.prototype, "index", void 0);
__decorate([
    Output(),
    __metadata("design:type", EventEmitter)
], TagComponent.prototype, "onSelect", void 0);
__decorate([
    Output(),
    __metadata("design:type", EventEmitter)
], TagComponent.prototype, "onRemove", void 0);
__decorate([
    Output(),
    __metadata("design:type", EventEmitter)
], TagComponent.prototype, "onBlur", void 0);
__decorate([
    Output(),
    __metadata("design:type", EventEmitter)
], TagComponent.prototype, "onKeyDown", void 0);
__decorate([
    Output(),
    __metadata("design:type", EventEmitter)
], TagComponent.prototype, "onTagEdited", void 0);
__decorate([
    ViewChild(TagRipple),
    __metadata("design:type", TagRipple)
], TagComponent.prototype, "ripple", void 0);
__decorate([
    HostListener('keydown', ['$event']),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], TagComponent.prototype, "keydown", null);
TagComponent = __decorate([
    Component({
        moduleId: module.id,
        selector: 'tag',
        templateUrl: './tag.template.html',
        styleUrls: ['./tag-component.style.scss']
    }),
    __metadata("design:paramtypes", [ElementRef, Renderer])
], TagComponent);
export { TagComponent };
//# sourceMappingURL=tag.component.js.map