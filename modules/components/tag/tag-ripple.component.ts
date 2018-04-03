import {
    Component,
    Input
} from '@angular/core';


import {
    animate,
    trigger,
    style,
    transition,
    keyframes,
    state
} from '@angular/animations';

@Component({
    selector: 'tag-ripple',
    styles: [`
        :host {
            width: 100%;
            height: 100%;
            left: 0;
            overflow: hidden;
            position: absolute;
        }
        
        .tag-ripple {
            background: rgba(0, 0, 0, 0.1);
            top: 50%;
            left: 50%;
            height: 100%;
            transform: translate(-50%, -50%);
            position: absolute;
        }
    `],
    template: `
        <div class="tag-ripple" [@ink]="state"></div>
    `,
    animations: [
        trigger('ink', [
            state('none', style({width: 0, opacity: 0})),
            transition('none => clicked', [
                animate(300, keyframes([
                    style({opacity: 1, offset: 0, width: '30%', borderRadius: '100%'}),
                    style({opacity: 1, offset: 0.5, width: '50%'}),
                    style({opacity: 0.5, offset: 1, width: '100%', borderRadius: '16px'})
                ]))
            ])
        ])
    ]
})
export class TagRipple {
    @Input() public state: string = 'none';
}
