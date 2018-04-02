import {
    Component,
    Input,
    Output,
    EventEmitter,
    TemplateRef,
    ElementRef,
    HostListener,
    HostBinding,
    ViewChild,
    ChangeDetectorRef,
    Renderer2
} from '@angular/core';

import { TagModel } from '../../core/accessor';
import { TagRipple } from '../tag/tag-ripple.component';

// angular universal hacks
/* tslint:disable-next-line */
const KeyboardEvent = (window as any).KeyboardEvent;
const MouseEvent = (window as any).MouseEvent;

// mocking navigator
const navigator = typeof window !== 'undefined' ? window.navigator : {
    userAgent: 'Chrome',
    vendor: 'Google Inc'
};

const isChrome = /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor);

@Component({
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
     * @name canAddTag
     */
    @Input() public canAddTag: (tag: TagModel) => boolean;

    /**
     * @name onSelect
     */
    @Output() public onSelect: EventEmitter<TagModel> = new EventEmitter<TagModel>();

    /**
     * @name onRemove
     */
    @Output() public onRemove: EventEmitter<TagModel> = new EventEmitter<TagModel>();

    /**
     * @name onBlur
     */
    @Output() public onBlur: EventEmitter<TagModel> = new EventEmitter<TagModel>();

    /**
     * @name onKeyDown
     */
    @Output() public onKeyDown: EventEmitter<any> = new EventEmitter<any>();

    /**
     * @name onTagEdited
     */
    @Output() public onTagEdited: EventEmitter<TagModel> = new EventEmitter<TagModel>();

    /**
     * @name readonly {boolean}
     */
    public get readonly(): boolean {
        return typeof this.model !== 'string' && this.model.readonly === true;
    };

    /**
     * @name editing
     */
    public editing = false;

    /**
     * @name moving
     */
    @HostBinding('class.moving') public moving: boolean;

    /**
     * @name rippleState
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
    public remove($event: MouseEvent): void {
        $event.stopPropagation();
        this.onRemove.emit(this);
    }

    /**
     * @name focus
     */
    public focus(): void {
        this.element.nativeElement.focus();
    }

    public move(): void {
        this.moving = true;
    }

    /**
     * @name keydown
     * @param event
     */
    @HostListener('keydown', ['$event'])
    public keydown(event: KeyboardEvent): void {
        if (this.editing) {
            event.keyCode === 13 ? this.disableEditMode(event) : undefined;
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
        if (this.editable) {
            this.editing ? undefined : this.activateEditMode();
        }
    }

    /**
     * @name onBlurred
     * @param event
     */
    public onBlurred(event: any): void {
        // Checks if it is editable first before handeling the onBlurred event in order to prevent
        // a bug in IE where tags are still editable with onlyFromAutocomplete set to true
		if (!this.editable) {
            return;
        }

        this.disableEditMode();

        const value: string = event.target.innerText;
        const result = typeof this.model === 'string' ? value :
            {...this.model, [this.displayBy]: value};

        this.onBlur.emit(result);
    }

    /**
     * @name getDisplayValue
     * @param item
     */
    public getDisplayValue(item: TagModel): string {
        return typeof item === 'string' ? item : item[this.displayBy];
    }

    /**
     * @desc returns whether the ripple is visible or not
     * only works in Chrome
     * @name isRippleVisible
     */
    public get isRippleVisible(): boolean {
        return !this.readonly &&
            !this.editing &&
            isChrome &&
            this.hasRipple;
    }

    /**
     * @name disableEditMode
     * @param $event
     */
    public disableEditMode($event?: KeyboardEvent): void {
        const classList = this.element.nativeElement.classList;
        const input = this.getContentEditableText();

        this.editing = false;
        classList.remove('tag--editing');

        if (!input) {
            this.setContentEditableText(this.model);
            return;
        }

        this.storeNewValue(input);
        this.cdRef.detectChanges();

        if ($event) {
            $event.preventDefault();
        }
    }

    /**
     * @name isDeleteIconVisible
     */
    public isDeleteIconVisible(): boolean {
        return !this.readonly &&
            !this.disabled &&
            this.removable &&
            !this.editing;
    }

    /**
     * @name getContentEditableText
     */
    private getContentEditableText(): string {
        const input = this.getContentEditable();

        return input ? input.innerText.trim() : '';
    }

    /**
     * @name setContentEditableText
     * @param model
     */
    private setContentEditableText(model: TagModel) {
        const input = this.getContentEditable();
        const value = this.getDisplayValue(model);

        input.innerText = value;
    }

    /**
     * @name
     */
    private activateEditMode(): void {
        const classList = this.element.nativeElement.classList;
        classList.add('tag--editing');

        this.editing = true;
    }

    /**
     * @name storeNewValue
     * @param input
     */
    private storeNewValue(input: string): void {
        const exists = (tag: TagModel) => {
            return typeof tag === 'string' ?
            tag === input :
            tag[this.displayBy] === input;
        };

        const hasId = () => {
            return this.model[this.identifyBy] !== this.model[this.displayBy];
        };

        // if the value changed, replace the value in the model
        if (exists(this.model)) {
            return;
        }

        const model = typeof this.model === 'string' ? input :
            {
                [this.identifyBy]: hasId() ? this.model[this.identifyBy] : input,
                [this.displayBy]: input
            };

        if (this.canAddTag(model)) {
            this.onTagEdited.emit({tag: model, index: this.index});
        } else {
            this.setContentEditableText(this.model);
        }
    }

    /**
     * @name getContentEditable
     */
    private getContentEditable(): HTMLInputElement {
        return this.element.nativeElement.querySelector('[contenteditable]');
    }
}
