import {
    Component,
    forwardRef,
    animate,
    trigger,
    style,
    transition,
    keyframes,
    state
} from '@angular/core';

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
    templateUrl: '../../modules/components/tag-input.template.html',
    animations: [
        trigger('flyInOut', [
            state('in', style({transform: 'translateX(0)'})),
            transition(':enter', [
                animate(300, keyframes([
                    style({opacity: 0, offset: 0}),
                    style({opacity: 0.5, offset: 0.3}),
                    style({opacity: 1, offset: 1.0})
                ]))
            ]),
            transition(':leave', [
                animate(150, keyframes([
                    style({opacity: 1, transform: 'translateX(0)', offset: 0}),
                    style({opacity: 1, transform: 'translateX(-15px)', offset: 0.7}),
                    style({opacity: 0, transform: 'translateX(100%)', offset: 1.0})
                ]))
            ])
        ])
    ]
})
export class CustomComponent extends TagInputComponent {}
