var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Ng2DropdownModule } from 'ng2-material-dropdown';
import { DeleteIconComponent } from './components/icon';
import { TagInputForm } from './components/tag-input-form';
import { TagInputComponent } from './components';
import { TagInputDropdown } from './components/dropdown/tag-input-dropdown.component';
import { HighlightPipe } from './components/pipes/highlight.pipe';
import { TagComponent } from './components/tag/tag.component';
import { TagRipple } from './components/tag/tag-ripple.component';
var TagInputModule = (function () {
    function TagInputModule() {
    }
    return TagInputModule;
}());
TagInputModule = __decorate([
    NgModule({
        imports: [
            CommonModule,
            ReactiveFormsModule,
            Ng2DropdownModule
        ],
        declarations: [
            TagInputComponent,
            DeleteIconComponent,
            TagInputForm,
            TagComponent,
            HighlightPipe,
            TagInputDropdown,
            TagRipple
        ],
        exports: [
            TagInputComponent,
            DeleteIconComponent,
            TagInputForm,
            TagComponent,
            HighlightPipe,
            TagInputDropdown,
            TagRipple
        ]
    })
], TagInputModule);
export { TagInputModule };
export { TagInputComponent, TagInputForm, TagInputDropdown, DeleteIconComponent, TagComponent, TagRipple };
//# sourceMappingURL=ng2-tag-input.module.js.map