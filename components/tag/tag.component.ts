import {
    Component,
    Input,
    Output,
    EventEmitter,
    ElementRef,
    Renderer
} from '@angular/core';

@Component({
    selector: 'tag',
    styles: [require('./tag.style.scss').toString()],
    template: require('./tag.template.html')
})
export class Tag implements TagComponent {
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
}
