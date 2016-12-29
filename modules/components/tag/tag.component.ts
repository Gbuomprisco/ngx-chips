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
    templateUrl: './tag.template.html',
    styles: [
        `:host,
         :host > div,
         :host > div:focus {
            outline: 0;
        }`
    ]
})
export class TagComponent {
    /**
     * @name model {TagModel}
     */
    @Input() public model: TagModel;

    /**
     * @name readonly
     */
    @Input() public readonly: boolean;

    /**
     * @name template
     */
    @Input() public template: TemplateRef<any>;

    /**
     * @name onSelect
     * @type {EventEmitter<TagModel>}
     */
    @Output() public onSelect: EventEmitter<TagModel> = new EventEmitter<TagModel>();

    /**
     * @name onRemove
     * @type {EventEmitter<TagModel>}
     */
    @Output() public onRemove: EventEmitter<TagModel> = new EventEmitter<TagModel>();

    /**
     * @name onBlur
     * @type {EventEmitter<TagModel>}
     */
    @Output() public onBlur: EventEmitter<TagModel> = new EventEmitter<TagModel>();

    /**
     * @name onKeyDown
     * @type {EventEmitter<any>}
     */
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
