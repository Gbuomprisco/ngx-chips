import { NgModule } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Ng2DropdownModule } from 'ng2-material-dropdown';
import { interval } from 'rxjs/observable/interval';
import { defaults, TagInputOptions, TagInputDropdownOptions } from './defaults';

import {
    DeleteIconComponent,
    TagComponent,
    TagInputComponent,
    TagInputDropdown,
    TagInputForm,
    TagRipple,
} from './components';

import { HighlightPipe, DragProvider } from './core';

export type Defaults = {
    tagInput?: {
        [P in keyof TagInputOptions]?: TagInputOptions[P];
    };
    dropdown?: {
        [P in keyof TagInputDropdownOptions]?: TagInputDropdownOptions[P];
    }
}

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
export class TagInputModule {
    public static defaults = defaults;

    /**
     * @name withDefaults
     * @param defaults
     */
    public static withDefaults(defaults: Defaults): void {
        TagInputModule.defaults.tagInput = {...TagInputModule.defaults.tagInput, ...defaults.tagInput};
        TagInputModule.defaults.dropdown = {...TagInputModule.defaults.dropdown, ...defaults.dropdown};
    }
}

export * from './components';
