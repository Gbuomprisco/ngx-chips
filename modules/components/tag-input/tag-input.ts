// angular
import {
    Component,
    forwardRef,
    HostBinding,
    Input,
    Output,
    EventEmitter,
    Renderer2,
    ViewChild,
    ViewChildren,
    ContentChildren,
    ContentChild,
    OnInit,
    TemplateRef,
    QueryList,
    AfterViewInit
} from '@angular/core';

import {
    AsyncValidatorFn,
    FormControl,
    NG_VALUE_ACCESSOR,
    ValidatorFn
} from '@angular/forms';

// rx
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/map';

// ng2-tag-input
import {
    TagInputAccessor,
    TagModel,
    listen,
    constants
} from '../../core';

import {
    TagInputForm,
    TagInputDropdown,
    TagComponent
} from '../../components';

import { animations } from './animations';

// angular universal hacks
/* tslint:disable-next-line */
const DragEvent = (global as any).DragEvent;

const CUSTOM_ACCESSOR = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => TagInputComponent),
    multi: true
};

/**
 * A component for entering a list of terms to be used with ngModel.
 */
@Component({
    selector: 'tag-input',
    providers: [CUSTOM_ACCESSOR],
    styleUrls: ['./tag-input.style.scss'],
    templateUrl: './tag-input.template.html',
    animations: animations
})
export class TagInputComponent extends TagInputAccessor implements OnInit, AfterViewInit {
    /**
     * @name separatorKeys
     * @desc keyboard keys with which a user can separate items
     * @type {Array}
     */
    @Input() public separatorKeys: string[] = [];

    /**
     * @name separatorKeyCodes
     * @desc keyboard key codes with which a user can separate items
     * @type {Array}
     */
    @Input() public separatorKeyCodes: number[] = [];

    /**
     * @name placeholder
     * @desc the placeholder of the input text
     * @type {string}
     */
    @Input() public placeholder: string = constants.PLACEHOLDER;

    /**
     * @name secondaryPlaceholder
     * @desc placeholder to appear when the input is empty
     * @type {string}
     */
    @Input() public secondaryPlaceholder: string = constants.SECONDARY_PLACEHOLDER;

    /**
     * @name maxItems
     * @desc maximum number of items that can be added
     * @type {number}
     */
    @Input() public maxItems: number;

    /**
     * @name transform
     * @desc function passed to the component to transform the value of the items, or reject them instead
     */
    @Input() public transform: (item: string) => string = (item) => item;

    /**
     * @name validators
     * @desc array of Validators that are used to validate the tag before it gets appended to the list
     * @type {Validators[]}
     */
    @Input() public validators: ValidatorFn[] = [];

    /**
     * @name asyncValidators
     * @desc array of AsyncValidator that are used to validate the tag before it gets appended to the list
     * @type {Array}
     */
    @Input() public asyncValidators: AsyncValidatorFn[] = [];

    /**
    * - if set to true, it will only possible to add items from the autocomplete
    * @name onlyFromAutocomplete
    * @type {Boolean}
    */
    @Input() public onlyFromAutocomplete = false;

	/**
     * @name errorMessages
     * @type {Map<string, string>}
     */
    @Input() public errorMessages: { [key: string]: string } = {};

    /**
     * @name theme
     * @type {string}
     */
    @Input() public theme: string;

    /**
     * @name onTextChangeDebounce
     * @type {number}
     */
    @Input() public onTextChangeDebounce = 250;

    /**
     * - custom id assigned to the input
     * @name id
     */
    @Input() public inputId: string;

    /**
     * - custom class assigned to the input
     */
    @Input() public inputClass: string;

    /**
     * - option to clear text input when the form is blurred
     * @name clearOnBlur
     */
    @Input() public clearOnBlur: string;

    /**
     * - hideForm
     * @name clearOnBlur
     */
    @Input() public hideForm: string;

    /**
     * @name addOnBlur
     */
    @Input() public addOnBlur: boolean;

    /**
     * @name addOnPaste
     */
    @Input() public addOnPaste: boolean;

    /**
     * - pattern used with the native method split() to separate patterns in the string pasted
     * @name pasteSplitPattern
     */
    @Input() public pasteSplitPattern = ',';

    /**
     * @name blinkIfDupe
     * @type {boolean}
     */
    @Input() public blinkIfDupe = true;

    /**
     * @name removable
     * @type {boolean}
     */
    @Input() public removable = true;

    /**
     * @name editable
     * @type {boolean}
     */
    @Input() public editable: boolean = undefined;

    /**
     * @name allowDupes
     * @type {boolean}
     */
    @Input() public allowDupes = false;

    /**
     * @description if set to true, the newly added tags will be added as strings, and not objects
     * @name modelAsStrings
     * @type {boolean}
     */
    @Input() public modelAsStrings = false;

    /**
     * @name trimTags
     * @type {boolean}
     */
    @Input() public trimTags = true;

    /**
     * @name inputText
     */
    @Input() public get inputText(): string {
        return this.inputTextValue;
    }

    /**
     * @name ripple
     * @type {boolean}
     */
    @Input() public ripple = true;

    /**
     * @name tabindex
     * @desc pass through the specified tabindex to the input
     * @type {string}
     */
    @Input() public tabindex: string = undefined;

    /**
     * @name disabled
     * @type {boolean}
     */
    @Input() public disabled = undefined;

    /**
     * @name dragZone
     * @type {string}
     */
    @Input() public dragZone: string = undefined;

    /**
     * @name onRemoving
     * @type {() => Observable<void>}
     */
    @Input() public onRemoving: (tag: TagModel) => Observable<TagModel>;

    /**
     * @name onAdding
     * @type {() => Observable<void>}
     */
    @Input() public onAdding: (tag: TagModel) => Observable<TagModel>;

    /**
     * @name onAdd
     * @desc event emitted when adding a new item
     * @type {EventEmitter<string>}
     */
    @Output() public onAdd = new EventEmitter<TagModel>();

    /**
     * @name onRemove
     * @desc event emitted when removing an existing item
     * @type {EventEmitter<string>}
     */
    @Output() public onRemove = new EventEmitter<TagModel>();

    /**
     * @name onSelect
     * @desc event emitted when selecting an item
     * @type {EventEmitter<string>}
     */
    @Output() public onSelect = new EventEmitter<TagModel>();

    /**
     * @name onFocus
     * @desc event emitted when the input is focused
     * @type {EventEmitter<string>}
     */
    @Output() public onFocus = new EventEmitter<string>();

    /**
     * @name onFocus
     * @desc event emitted when the input is blurred
     * @type {EventEmitter<string>}
     */
    @Output() public onBlur = new EventEmitter<string>();

    /**
     * @name onTextChange
     * @desc event emitted when the input value changes
     * @type {EventEmitter<string>}
     */
    @Output() public onTextChange = new EventEmitter<TagModel>();

    /**
     * - output triggered when text is pasted in the form
     * @name onPaste
     * @type {EventEmitter<TagModel>}
     */
    @Output() public onPaste = new EventEmitter<string>();

    /**
     * - output triggered when tag entered is not valid
     * @name onValidationError
     * @type {EventEmitter<string>}
     */
    @Output() public onValidationError = new EventEmitter<TagModel>();

    /**
     * - output triggered when tag is edited
     * @name onTagEdited
     * @type {EventEmitter<TagModel>}
     */
    @Output() public onTagEdited = new EventEmitter<TagModel>();

    /**
     * @name dropdown
     */
    @ContentChild(TagInputDropdown) public dropdown: TagInputDropdown;

    /**
     * @name template
     * @desc reference to the template if provided by the user
     * @type {TemplateRef}
     */
    @ContentChildren(TemplateRef, { descendants: false }) public templates: QueryList<TemplateRef<any>>;

	/**
     * @name inputForm
     * @type {TagInputForm}
     */
    @ViewChild(TagInputForm) public inputForm: TagInputForm;

    /**
     * @name selectedTag
     * @desc reference to the current selected tag
     * @type {String}
     */
    public selectedTag: TagModel;

    /**
     * @name isLoading
     * @type {boolean}
     */
    public isLoading = false;

    /**
     * @name isDropping
     * @type {boolean}
     */
    public isDropping = false;

    /**
     * @name isDragging
     * @type {boolean}
     */
    public isDragging = false;

    /**
     * @name inputText
     * @param text
     */
    public set inputText(text: string) {
        this.inputTextValue = text;
        this.inputTextChange.emit(text);
    }

    /**
     * @name tags
     * @desc list of Element items
     */
    @ViewChildren(TagComponent) public tags: QueryList<TagComponent>;

    /**
     * @name listeners
     * @desc array of events that get fired using @fireEvents
     * @type []
     */
    private listeners = {
        [constants.KEYDOWN]: <{ (fun): any }[]>[],
        [constants.KEYUP]: <{ (fun): any }[]>[],
        change: <{ (fun): any }[]>[]
    };

    /**
     * @description emitter for the 2-way data binding inputText value
     * @name inputTextChange
     * @type {EventEmitter}
     */
    @Output() public inputTextChange: EventEmitter<string> = new EventEmitter();

    /**
     * @description private variable to bind get/set
     * @name inputTextValue
     * @type {string}
     */
    public inputTextValue = '';

    /**
     * @desc removes the tab index if it is set - it will be passed through to the input
     * @name tabindexAttr
     * @type {string}
     */
    @HostBinding('attr.tabindex')
    public get tabindexAttr(): string {
        return this.tabindex !== undefined ? '-1' : undefined;
    }

    constructor(private renderer: Renderer2) {
        super();
    }

    /**
     * @name onRemoveRequested
     * @param tag
     * @param index
     */
    public onRemoveRequested(tag: TagModel, index: number): void {
        if (this.onRemoving) {
            this.onRemoving(tag)
                .subscribe((model: TagModel) => {
                    this.removeItem(model, index);
                });
        } else {
            this.removeItem(tag, index);
        }
    }

    /**
     * @name onAddingRequested
     * @param isFromAutocomplete {boolean}
     * @param tag {TagModel}
     */
    public onAddingRequested(isFromAutocomplete: boolean, tag: TagModel, index = undefined): void {
        if (!tag) {
            return;
        }

        if (this.onAdding) {
            this.onAdding(tag)
                .subscribe((model: TagModel) => {
                    this.addItem(isFromAutocomplete, model, index);
                });
        } else {
            this.addItem(isFromAutocomplete, tag, index);
        }
    }

    /**
     *
     * @param tag
     * @param isFromAutocomplete
     */
    public isTagValid(tag: TagModel, fromAutocomplete = false): boolean {
        const selectedItem = this.dropdown ? this.dropdown.selectedItem : undefined;

        if (selectedItem && !fromAutocomplete) {
            return;
        }

        const dupe = this.findDupe(tag, fromAutocomplete);

        // if so, give a visual cue and return false
        if (!this.allowDupes && dupe && this.blinkIfDupe) {
            const item = this.tags.find(_tag => {
                return this.getItemValue(_tag.model) === this.getItemValue(dupe);
            });

            if (!!item) {
                item.blink();
            }
        }

        const isFromAutocomplete = fromAutocomplete && this.onlyFromAutocomplete;

        const assertions = [
            // 1. there must be no dupe OR dupes are allowed
            !dupe || this.allowDupes === true,

            // 2. check max items has not been reached
            this.maxItemsReached === false,

            // 3. check item comes from autocomplete or onlyFromAutocomplete is false
            ((isFromAutocomplete) || this.onlyFromAutocomplete === false)
        ];

        return assertions.filter(item => item).length === assertions.length;
    }

    /**
     * @name appendTag
     * @param tag {TagModel}
     */
    public appendTag = (tag: TagModel, index = this.items.length): void => {
        const items = this.items;
        const model = this.modelAsStrings ? tag[this.identifyBy] : tag;
        this.items = [...items.slice(0, index), model, ...items.slice(index, items.length)];
    }

    /**
     * @name createTag
     * @param model
     * @returns {{}}
     */
    public createTag(model: TagModel): TagModel {
        const trim = (val: TagModel, key: string): TagModel => {
            return typeof val === 'string' ? val.trim() : val[key];
        };

        return {
            ...typeof model !== 'string' ? model : {},
            [this.displayBy]: this.trimTags ? trim(model, this.displayBy) : model,
            [this.identifyBy]: this.trimTags ? trim(model, this.identifyBy) : model
        };
    }

    /**
     * @name selectItem
     * @desc selects item passed as parameter as the selected tag
     * @param item
     * @param emit
     */
    public selectItem(item: TagModel, emit = true): void {
        const isReadonly = item && typeof item !== 'string' && item.readonly;
        if (isReadonly) {
            return;
        }

        this.selectedTag = item;

        if (emit) {
            this.onSelect.emit(item);
        }
    }

    /**
     * @name fireEvents
     * @desc goes through the list of the events for a given eventName, and fires each of them
     * @param eventName
     * @param $event
     */
    public fireEvents(eventName: string, $event?): void {
        this.listeners[eventName]
            .forEach(listener => listener.call(this, $event));
    }

    /**
     * @name handleKeydown
     * @desc handles action when the user hits a keyboard key
     * @param data
     */
    public handleKeydown(data: any): void {
        const event = data.event;
        const key = event.keyCode || event.which;

        switch (constants.KEY_PRESS_ACTIONS[key]) {
            case constants.ACTIONS_KEYS.DELETE:
                if (this.selectedTag && this.removable) {
                    const index = this.items.indexOf(this.selectedTag);
                    this.onRemoveRequested(this.selectedTag, index);
                }
                break;
            case constants.ACTIONS_KEYS.SWITCH_PREV:
                this.switchPrev(data.model);
                break;
            case constants.ACTIONS_KEYS.SWITCH_NEXT:
                this.switchNext(data.model);
                break;
            case constants.ACTIONS_KEYS.TAB:
                this.switchNext(data.model);
                break;
            default:
                return;
        }

        // prevent default behaviour
        event.preventDefault();
    }

    /**
     * @name seyInputValue
     * @param value
     * @returns {string}
     */
    public setInputValue(value: string): string {
        const item = value ? this.transform(value) : '';

        // update form value with the transformed item
        this.getControl().setValue(item);

        return item;
    }

    /**
     * @name getControl
     * @returns {FormControl}
     */
    private getControl(): FormControl {
        return <FormControl>this.inputForm.value;
    }

	/**
     * @name focus
     * @param applyFocus
     * @param displayAutocomplete
     */
    public focus(applyFocus = false, displayAutocomplete = false): void {
        if (this.isDragging) {
            return;
        }

        this.selectItem(undefined, false);

        if (applyFocus) {
            this.inputForm.focus();
            this.onFocus.emit(this.formValue);
        }

        if (displayAutocomplete && this.dropdown) {
            this.dropdown.show();
        }
    }

	/**
     * @name blur
     */
    public blur(): void {
        this.onTouched();

        this.onBlur.emit(this.formValue);
    }

    /**
     * @name hasErrors
     * @returns {boolean}
     */
    public hasErrors(): boolean {
        return this.inputForm && this.inputForm.hasErrors();
    }

    /**
     * @name isInputFocused
     * @returns {boolean}
     */
    public isInputFocused(): boolean {
        return this.inputForm && this.inputForm.isInputFocused();
    }

    /**
     * - this is the one way I found to tell if the template has been passed and it is not
     * the template for the menu item
     * @name hasCustomTemplate
     */
    public hasCustomTemplate(): boolean {
        const templates = this.templates;
        const template = templates ? templates.first : undefined;
        const menuTemplate = this.dropdown && this.dropdown.templates ?
            this.dropdown.templates.first : undefined;

        return template && template !== menuTemplate;
    }

    /**
     * @name switchNext
     * @param item { TagModel }
     */
    public switchNext(item: TagModel): void {
        if (this.tags.last.model === item) {
            this.focus(true);
            return;
        }

        const tags = this.tags.toArray();
        const tagIndex = tags.findIndex(tag => tag.model === item);
        const tag = tags[tagIndex + 1];

        tag.select.call(tag);
    }

    /**
     * @name switchPrev
     * @param item { TagModel }
     */
    public switchPrev(item: TagModel): void {
        if (this.tags.first.model !== item) {
            const tags = this.tags.toArray();
            const tagIndex = tags.findIndex(tag => tag.model === item);
            const tag = tags[tagIndex - 1];

            tag.select.call(tag);
        }
    }

	/**
     * @name maxItemsReached
     * @returns {boolean}
     */
    public get maxItemsReached(): boolean {
        return this.maxItems !== undefined &&
            this.items.length >= this.maxItems;
    }

    /**
     * @name formValue
     * @return {any}
     */
    public get formValue(): string {
        return this.inputForm.value.value;
    }

    /**
     * @name ngOnInit
     */
    public ngOnInit(): void {
        // if the number of items specified in the model is > of the value of maxItems
        // degrade gracefully and let the max number of items to be the number of items in the model
        // though, warn the user.
        const hasReachedMaxItems = this.maxItems !== undefined &&
            this.items &&
            this.items.length > this.maxItems;

        if (hasReachedMaxItems) {
            this.maxItems = this.items.length;
            console.warn(constants.MAX_ITEMS_WARNING);
        }
    }

    /**3
     * @name onDragStarted
     * @param event
     * @param index
     */
    public onDragStarted(event: DragEvent, index: number): void {
        event.stopPropagation();

        this.isDragging = true;

        const draggedElement: TagModel = this.items[index];
        const storedElement = { zone: this.dragZone, value: draggedElement };

        event.dataTransfer.setData(constants.DRAG_AND_DROP_KEY, JSON.stringify(storedElement));

        this.onRemoveRequested(draggedElement, index);
    }

    /**
     * @name onDragOver
     * @param event
     */
    public onDragOver(event: DragEvent): void {
        this.isDropping = true;

        event.preventDefault();
    }

    /**
     * @name onDragEnd
     */
    public onDragEnd(): void {
        this.isDragging = false;
        this.isDropping = false;
    }

    /**
     * @name onTagDropped
     * @param event
     * @param index
     */
    public onTagDropped(event: DragEvent, index: number): void {
        this.onDragEnd();

        const data = event.dataTransfer.getData(constants.DRAG_AND_DROP_KEY);
        const droppedElement = JSON.parse(data);

        if (droppedElement.zone !== this.dragZone) {
            return;
        }

        this.onAddingRequested(false, droppedElement.value, index);

        event.preventDefault();
        event.stopPropagation();
    }

    /**
     * @name ngAfterViewInit
     */
    public ngAfterViewInit(): void {
        // set up listeners

        this.setUpKeypressListeners();
        this.setupSeparatorKeysListener();
        this.setUpInputKeydownListeners();

        if (this.onTextChange.observers.length) {
            this.setUpTextChangeSubscriber();
        }

        // if clear on blur is set to true, subscribe to the event and clear the text's form
        if (this.clearOnBlur || this.addOnBlur) {
            this.setUpOnBlurSubscriber();
        }

        // if addOnPaste is set to true, register the handler and add items
        if (this.addOnPaste) {
            this.setUpOnPasteListener();
        }

        // if hideForm is set to true, remove the input
        if (this.hideForm) {
            this.inputForm.destroy();
        }
    }

    /**
     * @name onTagBlurred
     * @param changedElement {TagModel}
     * @param index {number}
     */
    public onTagBlurred(changedElement: TagModel, index: number): void {
        this.items[index] = changedElement;
        this.blur();
    }

    /**
     * @name trackBy
     * @param item
     * @returns {string}
     */
    public trackBy(item: TagModel): string {
        return item[this.identifyBy];
    }

    /**
     * @name removeItem
     * @desc removes an item from the array of the model
     * @param tag {TagModel}
     * @param index {number}
     */
    private removeItem(tag: TagModel, index: number): void {
        this.items = this.getItemsWithout(index);

        // if the removed tag was selected, set it as undefined
        if (this.selectedTag === tag) {
            this.selectItem(undefined, false);
        }

        // focus input
        this.focus(true, false);

        // emit remove event
        this.onRemove.emit(tag);
    }

    /**
     * @name addItem
     * @desc adds the current text model to the items array
     * @param fromAutocomplete
     * @param item
     */
    private addItem(fromAutocomplete = false, item: TagModel = this.formValue, index = undefined): void {
        /**
         * @name reset
         */
        const reset = (): void => {
            // reset control and focus input
            this.setInputValue('');

            // focus input
            this.focus(true, false);
        };

        /**
         * @name validationFilter
         * @param tag
         * @return {boolean}
         */
        const validationFilter = (tag: TagModel): boolean => {
            const isValid = this.isTagValid(tag, fromAutocomplete);

            if (!isValid) {
                this.onValidationError.emit(tag);
            }

            return isValid;
        };

        /**
         * @name appendItem
         * @param tag
         */
        const appendItem = (tag: TagModel): void => {
            this.appendTag(tag, index);

            // emit event
            this.onAdd.emit(tag);
        };

        Observable
            .of(this.getItemDisplay(item))
            .map(display => this.setInputValue(display))
            .filter(display => this.inputForm.form.valid && !!display)
            .map((display: string) => this.createTag(item))
            .filter(validationFilter)
            .subscribe(appendItem, undefined, reset);
    }

    /**
     * @name setupSeparatorKeysListener
     */
    private setupSeparatorKeysListener(): void {
        const useSeparatorKeys = this.separatorKeyCodes.length > 0 || this.separatorKeys.length > 0;

        listen.call(this, constants.KEYDOWN, ($event) => {
            const hasKeyCode = this.separatorKeyCodes.indexOf($event.keyCode) >= 0;
            const hasKey = this.separatorKeys.indexOf($event.key) >= 0;

            if (hasKeyCode || hasKey) {
                $event.preventDefault();
                this.onAddingRequested(false, this.formValue);
            }

        }, useSeparatorKeys);
    }

    /**
     * @name setUpKeypressListeners
     */
    private setUpKeypressListeners(): void {
        // setting up the keypress listeners
        listen.call(this, constants.KEYDOWN, ($event) => {
            const isCorrectKey = $event.keyCode === 37 || $event.keyCode === 8;

            if (isCorrectKey &&
                !this.formValue &&
                this.items.length) {
                this.tags.last.select.call(this.tags.last);
            }
        });
    }

    /**
     * @name setUpKeydownListeners
     */
    private setUpInputKeydownListeners(): void {
        this.inputForm.onKeydown.subscribe(event => {
            this.fireEvents('keydown', event);

            if (event.key === 'Backspace' && this.formValue === '') {
                event.preventDefault();
            }
        });
    }

    /**
     * @name setUpOnPasteListener
     */
    private setUpOnPasteListener(): void {
        const input = this.inputForm.input.nativeElement;

        // attach listener to input
        this.renderer.listen(input, 'paste', this.onPasteCallback.bind(this));
    }

    /**
     * @name setUpTextChangeSubscriber
     */
    private setUpTextChangeSubscriber(): void {
        this.inputForm.form.valueChanges
            .debounceTime(this.onTextChangeDebounce)
            .subscribe(() => this.onTextChange.emit(this.formValue));
    }

    /**
     * @name setUpOnBlurSubscriber
     */
    private setUpOnBlurSubscriber(): void {
        const filterFn = (): boolean => {
            return !(this.dropdown && this.dropdown.isVisible) && !!this.formValue;
        };

        this.inputForm
            .onBlur
            .filter(filterFn)
            .subscribe(() => {
                if (this.addOnBlur) {
                    this.onAddingRequested(false, this.formValue);
                }

                this.setInputValue('');
            });
    }

    /**
     * @name findDupe
     * @param tag
     * @param isFromAutocomplete
     * @return {undefined|TagModel}
     */
    private findDupe(tag: TagModel, isFromAutocomplete: boolean): TagModel {
        const identifyBy = isFromAutocomplete ? this.dropdown.identifyBy : this.identifyBy;
        return this.items
            .find((item: TagModel) => {
                return this.getItemValue(item) === tag[identifyBy];
            });
    }

    /**
     * @name onPasteCallback
     * @param data
     */
    private onPasteCallback(data: ClipboardEvent): void {
        const text = data.clipboardData.getData('text/plain');

        text.split(this.pasteSplitPattern)
            .map(item => this.createTag(item))
            .forEach(item => this.onAddingRequested(false, item));

        this.onPaste.emit(text);

        setTimeout(() => this.setInputValue(''), 0);
    }
}
