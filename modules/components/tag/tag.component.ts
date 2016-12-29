import {
    Component,
    Input,
    Output,
    EventEmitter,
    TemplateRef,
    ElementRef,
    Renderer,
    HostListener
} from '@angular/core';

import { TagModel } from '../helpers/accessor';

@Component({
    selector: 'tag',
    templateUrl: './tag.template.html'
})
export class TagComponent {
    @Input() public model: TagModel;
    @Input() public readonly: boolean;
    @Input() public template: TemplateRef<any>;

    @Output() public onSelect: EventEmitter<TagModel> = new EventEmitter<TagModel>();
    @Output() public onRemove: EventEmitter<TagModel> = new EventEmitter<TagModel>();
    @Output() public onBlur: EventEmitter<TagModel> = new EventEmitter<TagModel>();
    @Output() public onKeyDown: EventEmitter<any> = new EventEmitter<any>();

    constructor(public element: ElementRef, public renderer: Renderer) {}

    /**
     * @name select
     */
    public select($event?): void {
        if (this.readonly) {
            return;
        }

        if ($event) {
            $event.stopPropagation();
        }

        this.focus();

        this.onSelect.emit(this.model);
    }

    /**
     * @name remove
     */
    public remove(): void {
        this.onRemove.emit(this.model);
    }

    /**
     * @name focus
     */
    public focus(): void {
        this.renderer.invokeElementMethod(this.element.nativeElement, 'focus');
    }

    /**
     * @name keydown
     * @param event
     */
    @HostListener('keydown', ['$event'])
    public keydown(event: any): void {
        this.onKeyDown.emit({event, model: this.model});
    }
}
