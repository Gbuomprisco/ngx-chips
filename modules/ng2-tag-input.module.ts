import { NgModule } from '@angular/core';
import { DeleteIconComponent } from './components/icon';
import { TagInputComponent } from './components';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { Ng2DropdownModule } from 'ng2-material-dropdown';

@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        Ng2DropdownModule
    ],
    declarations: [
        TagInputComponent,
        DeleteIconComponent
    ],
    exports: [
        TagInputComponent,
        DeleteIconComponent
    ]
})
export class TagInputModule {}
