import { NgModule } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Ng2DropdownModule } from 'ng2-material-dropdown'
import { HighlightPipe, DragProvider, Options, OptionsProvider } from './core';

import {
    DeleteIconComponent,
    TagComponent,
    TagInputComponent,
    TagInputDropdown,
    TagInputForm,
    TagRipple
} from './components';

const COMPONENTS = [
    TagInputComponent,
    DeleteIconComponent,
    TagInputForm,
    TagComponent,
    HighlightPipe,
    TagInputDropdown,
    TagRipple
];

const optionsProvider = new OptionsProvider();

@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        FormsModule,
        Ng2DropdownModule
    ],
    declarations: COMPONENTS,
    exports: COMPONENTS,
    providers: [
        DragProvider
    ]
})
export class TagInputModule {
    /**
     * @name withDefaults
     * @param options {Options}
     */
    public static withDefaults(options: Options): void {
        optionsProvider.setOptions(options);
    }
}