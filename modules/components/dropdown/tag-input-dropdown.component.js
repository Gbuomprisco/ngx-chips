var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
import { Component, ViewChild, forwardRef, Inject, TemplateRef, ContentChildren, Input, QueryList, HostListener } from '@angular/core';
import { TagInputComponent } from '../tag-input';
import { Ng2Dropdown } from 'ng2-material-dropdown';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/filter';
var TagInputDropdown = (function () {
    function TagInputDropdown(tagInput) {
        var _this = this;
        this.tagInput = tagInput;
        this.offset = '50 0';
        this.focusFirstElement = false;
        this.showDropdownIfEmpty = false;
        this.minimumTextLength = 1;
        this.displayBy = 'display';
        this.identifyBy = 'value';
        this.matchingFn = function (value, target) {
            var targetValue = target[_this.displayBy].toString();
            return targetValue && targetValue
                .toLowerCase()
                .indexOf(value.toLowerCase()) >= 0;
        };
        this.appendToBody = true;
        this.items = [];
        this._autocompleteItems = [];
    }
    Object.defineProperty(TagInputDropdown.prototype, "autocompleteItems", {
        get: function () {
            var _this = this;
            return this._autocompleteItems ? this._autocompleteItems.map(function (item) {
                return typeof item !== 'string' ? item : (_a = {}, _a[_this.displayBy] = item, _a[_this.identifyBy] = item, _a);
                var _a;
            }) : [];
        },
        set: function (items) {
            this._autocompleteItems = items;
        },
        enumerable: true,
        configurable: true
    });
    TagInputDropdown.prototype.ngOnInit = function () {
        this.onItemClicked()
            .subscribe(this.addNewItem.bind(this));
        this.onHide()
            .subscribe(this.resetItems.bind(this));
        this.tagInput.inputForm.onKeyup
            .subscribe(this.show.bind(this));
        if (this.autocompleteObservable) {
            this.tagInput
                .onTextChange
                .filter(function (text) { return !!text.trim().length; })
                .subscribe(this.getItemsFromObservable.bind(this));
        }
    };
    TagInputDropdown.prototype.updatePosition = function () {
        this.dropdown.menu.updatePosition(this.tagInput.inputForm.getElementPosition());
    };
    Object.defineProperty(TagInputDropdown.prototype, "isVisible", {
        get: function () {
            return this.dropdown.menu.state.menuState.isVisible;
        },
        enumerable: true,
        configurable: true
    });
    TagInputDropdown.prototype.onHide = function () {
        return this.dropdown.onHide;
    };
    TagInputDropdown.prototype.onItemClicked = function () {
        return this.dropdown.onItemClicked;
    };
    Object.defineProperty(TagInputDropdown.prototype, "selectedItem", {
        get: function () {
            return this.dropdown.menu.state.dropdownState.selectedItem;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TagInputDropdown.prototype, "state", {
        get: function () {
            return this.dropdown.menu.state;
        },
        enumerable: true,
        configurable: true
    });
    TagInputDropdown.prototype.addNewItem = function (item) {
        if (!item) {
            return;
        }
        if (this.tagInput.isTagValid(item.value, true)) {
            var tag = this.tagInput.createTag(item.value[this.displayBy], item.value[this.identifyBy]);
            this.tagInput.appendNewTag(tag);
        }
        this.tagInput.setInputValue('');
        this.dropdown.hide();
        this.tagInput.focus(true, false);
    };
    TagInputDropdown.prototype.show = function () {
        var _this = this;
        var value = this.tagInput.inputForm.value.value.trim();
        var position = this.tagInput.inputForm.getElementPosition();
        var items = this.getMatchingItems(value);
        var hasItems = items.length > 0;
        var showDropdownIfEmpty = this.showDropdownIfEmpty && hasItems && !value;
        var hasMinimumText = value.length >= this.minimumTextLength;
        var assertions = [
            hasItems,
            this.isVisible === false,
            hasMinimumText
        ];
        var showDropdown = (assertions.filter(function (item) { return item; }).length === assertions.length) ||
            showDropdownIfEmpty;
        var hideDropdown = this.isVisible && (!hasItems || !hasMinimumText);
        this.setItems(items);
        if (showDropdown && !this.isVisible) {
            this.dropdown.show(position);
        }
        else if (hideDropdown) {
            this.dropdown.hide();
        }
        if (this.isVisible) {
            setTimeout(function () {
                _this.updatePosition();
            }, 0);
        }
    };
    TagInputDropdown.prototype.scrollListener = function () {
        if (!this.isVisible) {
            return;
        }
        this.updatePosition();
    };
    TagInputDropdown.prototype.getMatchingItems = function (value) {
        var _this = this;
        if (!value && !this.showDropdownIfEmpty) {
            return [];
        }
        return this.autocompleteItems.filter(function (item) {
            var hasValue = _this.tagInput.tags.filter(function (tag) {
                return tag.model[_this.tagInput.displayBy] === item[_this.displayBy];
            }).length > 0;
            return _this.matchingFn(value, item) && hasValue === false;
        });
    };
    TagInputDropdown.prototype.setItems = function (items) {
        this.items = items.slice(0, this.limitItemsTo || items.length);
    };
    TagInputDropdown.prototype.resetItems = function () {
        this.items = [];
    };
    TagInputDropdown.prototype.populateItems = function (data) {
        var _this = this;
        this.autocompleteItems = data.map(function (item) {
            return typeof item === 'string' ? (_a = {}, _a[_this.displayBy] = item, _a[_this.identifyBy] = item, _a) : item;
            var _a;
        });
    };
    TagInputDropdown.prototype.getItemsFromObservable = function (text) {
        var _this = this;
        this.tagInput.isLoading = true;
        this.autocompleteObservable(text)
            .subscribe(function (data) {
            _this.tagInput.isLoading = false;
            _this.populateItems(data);
            _this.show();
        }, function () {
            _this.tagInput.isLoading = false;
        });
    };
    return TagInputDropdown;
}());
__decorate([
    ViewChild(Ng2Dropdown),
    __metadata("design:type", Ng2Dropdown)
], TagInputDropdown.prototype, "dropdown", void 0);
__decorate([
    ContentChildren(TemplateRef),
    __metadata("design:type", QueryList)
], TagInputDropdown.prototype, "templates", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], TagInputDropdown.prototype, "offset", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], TagInputDropdown.prototype, "focusFirstElement", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], TagInputDropdown.prototype, "showDropdownIfEmpty", void 0);
__decorate([
    Input(),
    __metadata("design:type", Function)
], TagInputDropdown.prototype, "autocompleteObservable", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], TagInputDropdown.prototype, "minimumTextLength", void 0);
__decorate([
    Input(),
    __metadata("design:type", Number)
], TagInputDropdown.prototype, "limitItemsTo", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], TagInputDropdown.prototype, "displayBy", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], TagInputDropdown.prototype, "identifyBy", void 0);
__decorate([
    Input(),
    __metadata("design:type", Function)
], TagInputDropdown.prototype, "matchingFn", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], TagInputDropdown.prototype, "appendToBody", void 0);
__decorate([
    Input(),
    __metadata("design:type", Array),
    __metadata("design:paramtypes", [Array])
], TagInputDropdown.prototype, "autocompleteItems", null);
__decorate([
    HostListener('window:scroll'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], TagInputDropdown.prototype, "scrollListener", null);
TagInputDropdown = __decorate([
    Component({
        moduleId: module.id,
        selector: 'tag-input-dropdown',
        templateUrl: './tag-input-dropdown.template.html'
    }),
    __param(0, Inject(forwardRef(function () { return TagInputComponent; }))),
    __metadata("design:paramtypes", [TagInputComponent])
], TagInputDropdown);
export { TagInputDropdown };
//# sourceMappingURL=tag-input-dropdown.component.js.map