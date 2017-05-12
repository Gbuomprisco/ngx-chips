import {
    Component,
    Input,
    Output,
    EventEmitter,
    TemplateRef,
    ElementRef,
    HostListener,
    ViewChild,
    ChangeDetectorRef,
    Renderer2
} from '@angular/core';

import { TagModel } from '../../core';
import { TagRipple } from '../tag';

// angular universal hacks
/* tslint:disable-next-line */
const KeyboardEvent = (global as any).KeyboardEvent;

// mocking navigator
const navigator = typeof window !== 'undefined' ? window.navigator : {
    userAgent: 'Chrome',
    vendor: 'Google Inc'
};

const isChrome = /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor);

@Component({
    moduleId: module.id,
    selector: 'tag',
    templateUrl: './tag.template.html',
    styleUrls: [ './tag-component.style.scss' ]
})
export class TagComponent {
    /**
     * @name model {TagModel}
     */
    @Input() public model: TagModel;

    /**
     * @name readonly {boolean}
     */
    @Input() public readonly: boolean;

    /**
     * @name removable {boolean}
     */
    @Input() public removable: boolean;

    /**
     * @name editable {boolean}
     */
    @Input() public editable: boolean;

    /**
     * @name template {TemplateRef<any>}
     */
    @Input() public template: TemplateRef<any>;

    /**
     * @name displayBy {string}
     */
    @Input() public displayBy: string;

    /**
     * @name identifyBy {string}
     */
    @Input() public identifyBy: string;

    /**
     * @name index {number}
     */
    @Input() public index: number;

    /**
     * @name hasRipple
     */
    @Input() public hasRipple: boolean;

    /**
     * @name disabled
     */
    @Input() public disabled = false;

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

    /**
     * @name onTagEdited
     * @type {EventEmitter<any>}
     */
    @Output() public onTagEdited: EventEmitter<TagModel> = new EventEmitter<TagModel>();

    /**
     * @name editModeActivated
     * @type {boolean}
     */
    public editModeActivated = false;

    /**
     * @name rippleState
     * @type {string}
     */
    public rippleState = 'none';

    /**
     * @name ripple {TagRipple}
     */
    @ViewChild(TagRipple) public ripple: TagRipple;

    constructor(public element: ElementRef,
                public renderer: Renderer2,
                private cdRef: ChangeDetectorRef) {}

    /**
     * @name select
     */
    public select($event?: MouseEvent): void {
        if (this.readonly || this.disabled) {
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
        this.onRemove.emit(this);
    }

    /**
     * @name focus
     */
    public focus(): void {
        this.element.nativeElement.focus();
    }

    /**
     * @name keydown
     * @param event
     */
    @HostListener('keydown', ['$event'])
    public keydown(event: KeyboardEvent): void {
        if (this.editModeActivated) {
            event.keyCode === 13 ? this.disableEditMode(event) : this.storeNewValue();
            return;
        }

        this.onKeyDown.emit({event, model: this.model});
    }

    /**
     * @name blink
     */
    public blink(): void {
        const classList = this.element.nativeElement.classList;
        classList.add('blink');

        setTimeout(() => classList.remove('blink'), 50);
    }

    /**
     * @name toggleEditMode
     */
    public toggleEditMode(): void {
        const classList = this.element.nativeElement.classList;
        const className = 'tag--editing';

        if (this.editModeActivated) {
            this.storeNewValue();
        } else {
            this.element.nativeElement.querySelector('[contenteditable]').focus();
        }

        this.editModeActivated = !this.editModeActivated;
        this.editModeActivated ? classList.add(className) : classList.remove(className);
    }

    /**
     * @name onBlurred
     * @param event
     */
    public onBlurred(event: any): void {
        const newValue: string = event.target.innerText;
        this.toggleEditMode();
        const result = typeof this.model === 'string' ? newValue :
            {[this.identifyBy]: newValue, [this.displayBy]: newValue};
        this.onBlur.emit(result);
    }

    /**
     * @name getDisplayValue
     * @param item
     * @returns {string}
     */
    public getDisplayValue(item: TagModel): string {
        return typeof item === 'string' ? item : item[this.displayBy];
    }

    /**
     * @desc returns whether the ripple is visible or not
     * only works in Chrome
     * @name isRippleVisible
     * @returns {boolean}
     */
    public isRippleVisible(): boolean {
        return !this.readonly &&
            !this.editModeActivated &&
            isChrome &&
            this.hasRipple;
    }

    /**
     * @name getContentEditableText
     * @returns {string}
     */
    private getContentEditableText(): string {
        return this.element.nativeElement.querySelector('[contenteditable]').innerText.trim();
    }

    /**
     * @name disableEditMode
     * @param $event
     */
    private disableEditMode($event: KeyboardEvent): void {
        this.editModeActivated = false;
        $event.preventDefault();

        this.cdRef.detectChanges();
    }

    /**
     * @name storeNewValue
     */
    private storeNewValue(): void {
        const input = this.getContentEditableText();

        const exists = (model: TagModel) => {
            return typeof model === 'string' ?
                model === input :
                model[this.identifyBy] === input;
        };

        // if the value changed, replace the value in the model
        if (exists(this.model)) {
            const itemValue = this.model[this.identifyBy];

            this.model = typeof this.model === 'string' ? input :
                {[this.identifyBy]: itemValue, [this.displayBy]: itemValue};

            // emit output
            this.onTagEdited.emit(this.model);
        }
    }

    /**
     * @name isDeleteIconVisible
     * @returns {boolean}
     */
    private isDeleteIconVisible(): boolean {
        return !this.readonly &&
                !this.disabled &&
                this.removable &&
                !this.editModeActivated;
    }
}
