import { Component, forwardRef } from '@angular/core';
import { TagInputComponent } from '../../modules/components/tag-input.ts';
import { NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
    selector: 'custom-tag-input',
    providers: [{
        provide: NG_VALUE_ACCESSOR,
        useExisting: forwardRef(() => CustomComponent),
        multi: true
    }  ],
    styleUrls: [ './custom.scss' ],
    templateUrl: '../../modules/components/tag-input.template.html'
})
export class CustomComponent extends TagInputComponent {}
