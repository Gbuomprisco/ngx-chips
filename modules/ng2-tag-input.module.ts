import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Ng2DropdownModule } from 'ng2-material-dropdown';

import { DeleteIconComponent } from './components/icon';
import { TagInputForm } from './components/tag-input-form';
import { TagInputComponent } from './components';
import { TagInputDropdown } from './components/dropdown/tag-input-dropdown.component';
import { HighlightPipe } from './components/pipes/highlight.pipe';

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
        HighlightPipe,
        TagInputDropdown
    ],
    exports: [
        TagInputComponent,
        DeleteIconComponent,
        TagInputForm,
        HighlightPipe,
        TagInputDropdown
    ]
})
export class TagInputModule {}

export {
    TagInputComponent,
    TagInputForm,
    TagInputDropdown
}
