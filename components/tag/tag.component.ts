import {
    Component,
    Input,
    Output,
    EventEmitter,
    ElementRef,
    Renderer,
    OnInit
} from '@angular/core';

import {
    TagComponent
} from './tag.d';

const template = require('./tag.template.html'),
    styles =  [require('./tag.style.scss').toString()];

@Component({
    moduleId: module.id,
    selector: 'tag',
    styles,
    template
})
export class Tag implements TagComponent, OnInit {
    @Input() item: string;
    @Input() readonly: boolean;
    @Output() onRemove = new EventEmitter<TagComponent>();

    public isSelected: boolean;

    constructor(private element: ElementRef,
                private renderer: Renderer) {}

    public focus(): void {
        this.renderer.invokeElementMethod(this.element.nativeElement, 'focus', []);
    }

    public select(): void {
        this.isSelected = true;
    }

    public unselect(): void {
        this.isSelected = false;
    }

    public remove(): void {
        this.onRemove.emit(this);
    }

    ngOnInit() {}
}
