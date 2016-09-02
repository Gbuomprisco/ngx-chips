import { NgModule } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { DeleteIconComponent } from './components/icon';
import { TagInputComponent } from './components';

import { NG2_DROPDOWN_DIRECTIVES } from 'ng2-material-dropdown';

@NgModule({
    imports: [
        FormsModule,
        ReactiveFormsModule
    ],
    declarations: [
        DeleteIconComponent,
        ...NG2_DROPDOWN_DIRECTIVES,
        TagInputComponent
    ],
    exports: [
        DeleteIconComponent,
        ...NG2_DROPDOWN_DIRECTIVES,
        TagInputComponent
    ]
})
export class TagInput {}
