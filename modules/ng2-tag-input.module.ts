import { NgModule } from '@angular/core';
import { DeleteIconComponent } from './components/icon';
import { TagInputForm } from './components/tag-input-form';
import { TagInputComponent } from './components';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { HighlightPipe } from './components/pipes/highlight.pipe';
import { Ng2DropdownModule } from 'ng2-material-dropdown';

@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        Ng2DropdownModule
    ],
    declarations: [
        TagInputComponent,
        DeleteIconComponent,
        TagInputForm,
        HighlightPipe
    ],
    exports: [
        TagInputComponent,
        DeleteIconComponent,
        TagInputForm,
        HighlightPipe
    ]
})
export class TagInputModule {}
