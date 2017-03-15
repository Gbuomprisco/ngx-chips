var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component, forwardRef, Input, Output, EventEmitter, Renderer, ViewChild, ViewChildren, ContentChildren, ContentChild, TemplateRef, QueryList, animate, trigger, style, transition, keyframes, state } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import * as constants from './helpers/constants';
import listen from './helpers/listen';
import { TagInputAccessor } from './helpers/accessor';
import { TagInputForm } from './tag-input-form/tag-input-form.component';
import { TagInputDropdown } from './dropdown/tag-input-dropdown.component';
import { TagComponent } from './tag/tag.component';
import 'rxjs/add/operator/debounceTime';
var TagInputComponent = TagInputComponent_1 = (function (_super) {
    __extends(TagInputComponent, _super);
    function TagInputComponent(renderer) {
        var _this = _super.call(this) || this;
        _this.renderer = renderer;
        _this.separatorKeys = [];
        _this.separatorKeyCodes = [];
        _this.placeholder = constants.PLACEHOLDER;
        _this.secondaryPlaceholder = constants.SECONDARY_PLACEHOLDER;
        _this.transform = function (item) { return item; };
        _this.validators = [];
        _this.onlyFromAutocomplete = false;
        _this.errorMessages = {};
        _this.theme = 'default';
        _this.onTextChangeDebounce = 250;
        _this.pasteSplitPattern = ',';
        _this.blinkIfDupe = true;
        _this.removable = true;
        _this.editable = false;
        _this.allowDupes = false;
        _this.modelAsStrings = false;
        _this.trimTags = true;
        _this.onAdd = new EventEmitter();
        _this.onRemove = new EventEmitter();
        _this.onSelect = new EventEmitter();
        _this.onFocus = new EventEmitter();
        _this.onBlur = new EventEmitter();
        _this.onTextChange = new EventEmitter();
        _this.onPaste = new EventEmitter();
        _this.onValidationError = new EventEmitter();
        _this.onTagEdited = new EventEmitter();
        _this.listeners = (_a = {},
            _a[constants.KEYDOWN] = [],
            _a[constants.KEYUP] = [],
            _a.change = [],
            _a);
        _this.isLoading = false;
        return _this;
        var _a;
    }
    TagInputComponent.prototype.removeItem = function (tag, index) {
        this.items = this.getItemsWithout(index);
        if (this.selectedTag === tag) {
            this.selectedTag = undefined;
        }
        this.focus(true, false);
        this.onRemove.emit(tag);
    };
    TagInputComponent.prototype.addItem = function (isFromAutocomplete) {
        if (isFromAutocomplete === void 0) { isFromAutocomplete = false; }
        var inputValue = this.setInputValue(this.inputForm.value.value);
        var tag = this.createTag(inputValue, inputValue);
        if (!this.inputForm.form.valid || !inputValue) {
            return;
        }
        var isValid = this.isTagValid(tag, isFromAutocomplete);
        isValid ? this.appendNewTag(tag) : this.onValidationError.emit(tag);
        this.setInputValue('');
        this.focus(true, false);
    };
    TagInputComponent.prototype.isTagValid = function (tag, isFromAutocomplete) {
        var _this = this;
        if (isFromAutocomplete === void 0) { isFromAutocomplete = false; }
        var selectedItem = this.dropdown ? this.dropdown.selectedItem : undefined;
        if (selectedItem && !isFromAutocomplete) {
            return;
        }
        var dupe = this.items.find(function (item) {
            var identifyBy = isFromAutocomplete ? _this.dropdown.identifyBy : _this.identifyBy;
            var displayBy = isFromAutocomplete ? _this.dropdown.displayBy : _this.displayBy;
            return _this.getItemValue(item) === tag[identifyBy] ||
                item[_this.identifyBy] === tag[identifyBy] ||
                item[_this.displayBy] === tag[displayBy];
        });
        var hasDupe = !!dupe && dupe !== undefined;
        if (!this.allowDupes && hasDupe && this.blinkIfDupe) {
            var item = this.tags.find(function (_tag) {
                return _this.getItemValue(_tag.model) === _this.getItemValue(dupe);
            });
            if (item) {
                item.blink();
            }
        }
        var fromAutocomplete = isFromAutocomplete && this.onlyFromAutocomplete;
        var assertions = [
            !hasDupe || this.allowDupes === true,
            this.maxItemsReached === false,
            ((fromAutocomplete) || this.onlyFromAutocomplete === false)
        ];
        return assertions.filter(function (item) { return item; }).length === assertions.length;
    };
    TagInputComponent.prototype.appendNewTag = function (tag) {
        var newTag = this.modelAsStrings ? tag[this.identifyBy] : tag;
        this.items = this.items.concat([newTag]);
        this.onAdd.emit(tag);
    };
    TagInputComponent.prototype.createTag = function (display, value) {
        var trim = function (val) { return typeof val === 'string' ? val.trim() : val; };
        return _a = {},
            _a[this.displayBy] = this.trimTags ? trim(display) : display,
            _a[this.identifyBy] = this.trimTags ? trim(value) : value,
            _a;
        var _a;
    };
    TagInputComponent.prototype.selectItem = function (item) {
        if (this.readonly || !item) {
            return;
        }
        this.selectedTag = item;
        this.onSelect.emit(item);
    };
    TagInputComponent.prototype.fireEvents = function (eventName, $event) {
        var _this = this;
        this.listeners[eventName].forEach(function (listener) { return listener.call(_this, $event); });
    };
    TagInputComponent.prototype.handleKeydown = function (data) {
        var event = data.event;
        var key = event.keyCode || event.which;
        switch (constants.KEY_PRESS_ACTIONS[key]) {
            case constants.ACTIONS_KEYS.DELETE:
                if (this.selectedTag && this.removable) {
                    this.removeItem(this.selectedTag, this.items.indexOf(this.selectedTag));
                }
                break;
            case constants.ACTIONS_KEYS.SWITCH_PREV:
                this.switchPrev(data.model);
                break;
            case constants.ACTIONS_KEYS.SWITCH_NEXT:
                this.switchNext(data.model);
                break;
            case constants.ACTIONS_KEYS.TAB:
                this.switchNext(data.model);
                break;
            default:
                return;
        }
        event.preventDefault();
    };
    TagInputComponent.prototype.setInputValue = function (value) {
        var item = value ? this.transform(value) : '';
        var control = this.getControl();
        control.setValue(item);
        return item;
    };
    TagInputComponent.prototype.getControl = function () {
        return this.inputForm.value;
    };
    TagInputComponent.prototype.focus = function (applyFocus, displayAutocomplete) {
        if (applyFocus === void 0) { applyFocus = false; }
        if (displayAutocomplete === void 0) { displayAutocomplete = false; }
        if (this.readonly) {
            return;
        }
        var value = this.inputForm.value.value;
        this.selectedTag = undefined;
        if (applyFocus) {
            this.inputForm.focus();
        }
        if (displayAutocomplete && this.dropdown) {
            this.dropdown.show();
        }
        this.onFocus.emit(value);
    };
    TagInputComponent.prototype.blur = function () {
        this.onBlur.emit(this.inputForm.value.value);
    };
    TagInputComponent.prototype.hasErrors = function () {
        return this.inputForm && this.inputForm.hasErrors();
    };
    TagInputComponent.prototype.isInputFocused = function () {
        return this.inputForm && this.inputForm.isInputFocused();
    };
    TagInputComponent.prototype.hasCustomTemplate = function () {
        var template = this.templates ? this.templates.first : undefined;
        var menuTemplate = this.dropdown && this.dropdown.templates ? this.dropdown.templates.first : undefined;
        return template && template !== menuTemplate;
    };
    TagInputComponent.prototype.switchNext = function (item) {
        if (this.tags.last.model === item) {
            this.focus(true);
            return;
        }
        var tags = this.tags.toArray();
        var tagIndex = tags.findIndex(function (tag) { return tag.model === item; });
        var tag = tags[tagIndex + 1];
        tag.select.call(tag);
    };
    TagInputComponent.prototype.switchPrev = function (item) {
        if (this.tags.first.model !== item) {
            var tags = this.tags.toArray();
            var tagIndex = tags.findIndex(function (tag) { return tag.model === item; });
            var tag = tags[tagIndex - 1];
            tag.select.call(tag);
        }
    };
    Object.defineProperty(TagInputComponent.prototype, "maxItemsReached", {
        get: function () {
            return this.maxItems !== undefined && this.items.length >= this.maxItems;
        },
        enumerable: true,
        configurable: true
    });
    TagInputComponent.prototype.trackBy = function (item) {
        return item[this.identifyBy];
    };
    TagInputComponent.prototype.onPasteCallback = function (data) {
        var _this = this;
        var text = data.clipboardData.getData('text/plain');
        text.split(this.pasteSplitPattern)
            .map(function (item) { return _this.createTag(item, item); })
            .forEach(function (item) {
            var display = _this.transform(item[_this.displayBy]);
            var tag = _this.createTag(display, display);
            if (_this.isTagValid(tag)) {
                _this.appendNewTag(tag);
            }
        });
        this.onPaste.emit(text);
        setTimeout(function () { return _this.setInputValue(''); }, 0);
    };
    TagInputComponent.prototype.ngOnInit = function () {
        var _this = this;
        listen.call(this, constants.KEYDOWN, function ($event) {
            var itemsLength = _this.items.length, inputValue = _this.inputForm.value.value, isCorrectKey = $event.keyCode === 37 || $event.keyCode === 8;
            if (isCorrectKey && !inputValue && itemsLength) {
                _this.tags.last.select.call(_this.tags.last);
            }
        });
        listen.call(this, constants.KEYDOWN, function ($event) {
            var hasKeyCode = _this.separatorKeyCodes.indexOf($event.keyCode) >= 0;
            var hasKey = _this.separatorKeys.indexOf($event.key) >= 0;
            if (hasKeyCode || hasKey) {
                $event.preventDefault();
                _this.addItem();
            }
        }, this.separatorKeyCodes.length > 0 || this.separatorKeys.length > 0);
        var maxItemsReached = this.maxItems !== undefined && this.items && this.items.length > this.maxItems;
        if (maxItemsReached) {
            this.maxItems = this.items.length;
            console.warn(constants.MAX_ITEMS_WARNING);
        }
    };
    TagInputComponent.prototype.ngAfterViewInit = function () {
        var _this = this;
        this.inputForm.onKeydown.subscribe(function (event) {
            _this.fireEvents('keydown', event);
            if (event.key === 'Backspace' && _this.inputForm.value.value === '') {
                event.preventDefault();
            }
        });
        if (this.onTextChange.observers.length) {
            this.inputForm.form.valueChanges
                .debounceTime(this.onTextChangeDebounce)
                .subscribe(function () {
                var value = _this.inputForm.value.value;
                _this.onTextChange.emit(value);
            });
        }
        if (this.clearOnBlur || this.addOnBlur) {
            this.inputForm
                .onBlur
                .subscribe(function () {
                if (_this.addOnBlur) {
                    _this.addItem();
                }
                _this.setInputValue('');
            });
        }
        if (this.addOnPaste) {
            var input = this.inputForm.input.nativeElement;
            this.renderer.listen(input, 'paste', this.onPasteCallback.bind(this));
        }
        if (this.hideForm) {
            this.inputForm.destroy();
        }
    };
    return TagInputComponent;
}(TagInputAccessor));
__decorate([
    Input(),
    __metadata("design:type", Array)
], TagInputComponent.prototype, "separatorKeys", void 0);
__decorate([
    Input(),
    __metadata("design:type", Array)
], TagInputComponent.prototype, "separatorKeyCodes", void 0);
__decorate([
    Input(),
    __metadata("design:type", String)
], TagInputComponent.prototype, "placeholder", void 0);
__decorate([
    Input(),
    __metadata("design:type", String)
], TagInputComponent.prototype, "secondaryPlaceholder", void 0);
__decorate([
    Input(),
    __metadata("design:type", Number)
], TagInputComponent.prototype, "maxItems", void 0);
__decorate([
    Input(),
    __metadata("design:type", Boolean)
], TagInputComponent.prototype, "readonly", void 0);
__decorate([
    Input(),
    __metadata("design:type", Function)
], TagInputComponent.prototype, "transform", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], TagInputComponent.prototype, "validators", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], TagInputComponent.prototype, "onlyFromAutocomplete", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], TagInputComponent.prototype, "errorMessages", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], TagInputComponent.prototype, "theme", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], TagInputComponent.prototype, "onTextChangeDebounce", void 0);
__decorate([
    Input(),
    __metadata("design:type", String)
], TagInputComponent.prototype, "inputId", void 0);
__decorate([
    Input(),
    __metadata("design:type", String)
], TagInputComponent.prototype, "inputClass", void 0);
__decorate([
    Input(),
    __metadata("design:type", String)
], TagInputComponent.prototype, "clearOnBlur", void 0);
__decorate([
    Input(),
    __metadata("design:type", String)
], TagInputComponent.prototype, "hideForm", void 0);
__decorate([
    Input(),
    __metadata("design:type", Boolean)
], TagInputComponent.prototype, "addOnBlur", void 0);
__decorate([
    Input(),
    __metadata("design:type", Boolean)
], TagInputComponent.prototype, "addOnPaste", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], TagInputComponent.prototype, "pasteSplitPattern", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], TagInputComponent.prototype, "blinkIfDupe", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], TagInputComponent.prototype, "removable", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], TagInputComponent.prototype, "editable", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], TagInputComponent.prototype, "allowDupes", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], TagInputComponent.prototype, "modelAsStrings", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], TagInputComponent.prototype, "trimTags", void 0);
__decorate([
    Output(),
    __metadata("design:type", Object)
], TagInputComponent.prototype, "onAdd", void 0);
__decorate([
    Output(),
    __metadata("design:type", Object)
], TagInputComponent.prototype, "onRemove", void 0);
__decorate([
    Output(),
    __metadata("design:type", Object)
], TagInputComponent.prototype, "onSelect", void 0);
__decorate([
    Output(),
    __metadata("design:type", Object)
], TagInputComponent.prototype, "onFocus", void 0);
__decorate([
    Output(),
    __metadata("design:type", Object)
], TagInputComponent.prototype, "onBlur", void 0);
__decorate([
    Output(),
    __metadata("design:type", Object)
], TagInputComponent.prototype, "onTextChange", void 0);
__decorate([
    Output(),
    __metadata("design:type", Object)
], TagInputComponent.prototype, "onPaste", void 0);
__decorate([
    Output(),
    __metadata("design:type", Object)
], TagInputComponent.prototype, "onValidationError", void 0);
__decorate([
    Output(),
    __metadata("design:type", Object)
], TagInputComponent.prototype, "onTagEdited", void 0);
__decorate([
    ContentChild(TagInputDropdown),
    __metadata("design:type", TagInputDropdown)
], TagInputComponent.prototype, "dropdown", void 0);
__decorate([
    ContentChildren(TemplateRef, { descendants: false }),
    __metadata("design:type", QueryList)
], TagInputComponent.prototype, "templates", void 0);
__decorate([
    ViewChild(TagInputForm),
    __metadata("design:type", TagInputForm)
], TagInputComponent.prototype, "inputForm", void 0);
__decorate([
    ViewChildren(TagComponent),
    __metadata("design:type", QueryList)
], TagInputComponent.prototype, "tags", void 0);
TagInputComponent = TagInputComponent_1 = __decorate([
    Component({
        moduleId: module.id,
        selector: 'tag-input',
        providers: [{
                provide: NG_VALUE_ACCESSOR,
                useExisting: forwardRef(function () { return TagInputComponent_1; }),
                multi: true
            }],
        styleUrls: ['./tag-input.style.scss'],
        templateUrl: './tag-input.template.html',
        animations: [
            trigger('flyInOut', [
                state('in', style({ transform: 'translateX(0)' })),
                transition(':enter', [
                    animate(250, keyframes([
                        style({ opacity: 0, offset: 0, transform: 'translate(0px, 20px)' }),
                        style({ opacity: 0.3, offset: 0.3, transform: 'translate(0px, -10px)' }),
                        style({ opacity: 0.5, offset: 0.5, transform: 'translate(0px, 0px)' }),
                        style({ opacity: 0.75, offset: 0.75, transform: 'translate(0px, 5px)' }),
                        style({ opacity: 1, offset: 1, transform: 'translate(0px, 0px)' })
                    ]))
                ]),
                transition(':leave', [
                    animate(150, keyframes([
                        style({ opacity: 1, transform: 'translateX(0)', offset: 0 }),
                        style({ opacity: 1, transform: 'translateX(-15px)', offset: 0.7 }),
                        style({ opacity: 0, transform: 'translateX(100%)', offset: 1.0 })
                    ]))
                ])
            ])
        ]
    }),
    __metadata("design:paramtypes", [Renderer])
], TagInputComponent);
export { TagInputComponent };
var TagInputComponent_1;
//# sourceMappingURL=tag-input.js.map