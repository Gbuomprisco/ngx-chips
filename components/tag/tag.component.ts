import {Component, Input, Output, EventEmitter} from '@angular/core';
import {TagComponent} from './tag.component.d.ts';

@Component({
    selector: 'tag',
    styles: [require('./tag.style.scss').toString()],
    template: require('./tag.template.html')
})
export class Tag implements TagComponent {
    @Input() item: string;
    @Input() readonly: boolean;
    @Input() isSelected: boolean;
    @Output() onRemove = new EventEmitter<string>();
    
    public remove(): void {
        this.onRemove.emit(this.item);
    }
}