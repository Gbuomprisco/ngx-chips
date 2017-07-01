import { NgModule } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { Ng2DropdownModule } from 'ng2-material-dropdown';

import {
    DeleteIconComponent,
    TagComponent,
    TagInputComponent,
    TagInputDropdown,
    TagInputForm,
    TagRipple,
} from './components';

import { HighlightPipe, DragProvider } from './core';

@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        FormsModule,
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
    ],
    providers: [
        DragProvider
    ]
})
export class TagInputModule {}

export * from './components';
