import {
    Component,
    animate,
    trigger,
    style,
    transition,
    keyframes,
    state,
    Input
} from '@angular/core';

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
                animate(200, keyframes([
                    style({opacity: 1, offset: 0, width: 0, height: 0, borderRadius: '100%'}),
                    style({opacity: 1, offset: 0.15, width: '15%', height: '30%'}),
                    style({opacity: 1, offset: 0.35, width: '35%', height: '50%'}),
                    style({opacity: 1, offset: 0.5, width: '50%', height: '75%'}),
                    style({opacity: 1, offset: 0.8, width: '80%', height: '90%'}),
                    style({opacity: 1, offset: 1, width: '100%', height: '100%', borderRadius: '16px'})
                ]))
            ])
        ])
    ]
})
export class TagRipple {
    @Input() public state: string = 'none';
}
