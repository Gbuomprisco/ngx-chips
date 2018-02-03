import {
    animate,
    trigger,
    style,
    transition,
    keyframes,
    state,
    AnimationTriggerMetadata
} from '@angular/animations';

/**
 * @name animations
 */
export const animations = [
    trigger('animation', [
        state('in', style({
            opacity: 1
        })),
        state('out', style({
            opacity: 0
        })),
        transition(':enter', [
            animate("{{ enter }}", keyframes([
                style({opacity: 0, offset: 0, transform: 'translate(0px, 20px)'}),
                style({opacity: 0.3, offset: 0.3, transform: 'translate(0px, -10px)'}),
                style({opacity: 0.5, offset: 0.5, transform: 'translate(0px, 0px)'}),
                style({opacity: 0.75, offset: 0.75, transform: 'translate(0px, 5px)'}),
                style({opacity: 1, offset: 1, transform: 'translate(0px, 0px)'})
            ]))
        ]),
        transition(':leave', [
            animate("{{ leave }}", keyframes([
                style({opacity: 1, transform: 'translateX(0)', offset: 0}),
                style({opacity: 1, transform: 'translateX(-15px)', offset: 0.7}),
                style({opacity: 0, transform: 'translateX(100%)', offset: 1.0})
            ]))
        ])
    ])
];
