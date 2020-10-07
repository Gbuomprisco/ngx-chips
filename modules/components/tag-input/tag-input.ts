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
import { Observable } from 'rxjs';
import { debounceTime, filter, map, first } from 'rxjs/operators';

// ng2-tag-input
import { TagInputAccessor, TagModel } from '../../core/accessor';
import { listen } from '../../core/helpers/listen';
import * as constants from '../../core/constants';

import { DragProvider, DraggedTag } from '../../core/providers/drag-provider';

import { TagInputForm } from '../tag-input-form/tag-input-form.component';
import { TagComponent } from '../tag/tag.component';

import { animations } from './animations';
import { defaults } from '../../defaults';
import { TagInputDropdown } from '../dropdown/tag-input-dropdown.component';

// angular universal hacks
/* tslint:disable-next-line */
const DragEvent = (window as any).DragEvent;

const CUSTOM_ACCESSOR = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => TagInputComponent),
    multi: true
};
@Component({
    selector: 'tag-input',
    providers: [CUSTOM_ACCESSOR],
    styleUrls: ['./tag-input.style.scss'],
    templateUrl: './tag-input.template.html',
    animations
})
export class TagInputComponent extends TagInputAccessor implements OnInit, AfterViewInit {
    /**
     * @name separatorKeys
     * @desc keyboard keys with which a user can separate items
     */
    @Input() public separatorKeys: string[] = defaults.tagInput.separatorKeys;

    /**
     * @name separatorKeyCodes
     * @desc keyboard key codes with which a user can separate items
     */
    @Input() public separatorKeyCodes: number[] = defaults.tagInput.separatorKeyCodes;

    /**
     * @name placeholder
     * @desc the placeholder of the input text
     */
    @Input() public placeholder: string = defaults.tagInput.placeholder;

    /**
     * @name secondaryPlaceholder
     * @desc placeholder to appear when the input is empty
     */
    @Input() public secondaryPlaceholder: string = defaults.tagInput.secondaryPlaceholder;

    /**
     * @name maxItems
     * @desc maximum number of items that can be added
     */
    @Input() public maxItems: number = defaults.tagInput.maxItems;

    /**
     * @name validators
     * @desc array of Validators that are used to validate the tag before it gets appended to the list
     */
    @Input() public validators: ValidatorFn[] = defaults.tagInput.validators;

    /**
     * @name asyncValidators
     * @desc array of AsyncValidator that are used to validate the tag before it gets appended to the list
     */
    @Input() public asyncValidators: AsyncValidatorFn[] = defaults.tagInput.asyncValidators;

    /**
    * - if set to true, it will only possible to add items from the autocomplete
    * @name onlyFromAutocomplete
    */
    @Input() public onlyFromAutocomplete = defaults.tagInput.onlyFromAutocomplete;

    /**
     * @name errorMessages
     */
    @Input() public errorMessages: { [key: string]: string } = defaults.tagInput.errorMessages;

    /**
     * @name theme
     */
    @Input() public theme: string = defaults.tagInput.theme;

    /**
     * @name onTextChangeDebounce
     */
    @Input() public onTextChangeDebounce = defaults.tagInput.onTextChangeDebounce;

    /**
     * - custom id assigned to the input
     * @name id
     */
    @Input() public inputId = defaults.tagInput.inputId;

    /**
     * - custom class assigned to the input
     */
    @Input() public inputClass: string = defaults.tagInput.inputClass;

    /**
     * - option to clear text input when the form is blurred
     * @name clearOnBlur
     */
    @Input() public clearOnBlur: boolean = defaults.tagInput.clearOnBlur;

    /**
     * - hideForm
     * @name clearOnBlur
     */
    @Input() public hideForm: boolean = defaults.tagInput.hideForm;

    /**
     * @name addOnBlur
     */
    @Input() public addOnBlur: boolean = defaults.tagInput.addOnBlur;

    /**
     * @name addOnPaste
     */
    @Input() public addOnPaste: boolean = defaults.tagInput.addOnPaste;

    /**
     * - pattern used with the native method split() to separate patterns in the string pasted
     * @name pasteSplitPattern
     */
    @Input() public pasteSplitPattern = defaults.tagInput.pasteSplitPattern;

    /**
     * @name blinkIfDupe
     */
    @Input() public blinkIfDupe = defaults.tagInput.blinkIfDupe;

    /**
     * @name removable
     */
    @Input() public removable = defaults.tagInput.removable;

    /**
     * @name editable
     */
    @Input() public editable: boolean = defaults.tagInput.editable;

    /**
     * @name allowDupes
     */
    @Input() public allowDupes = defaults.tagInput.allowDupes;

    /**
     * @description if set to true, the newly added tags will be added as strings, and not objects
     * @name modelAsStrings
     */
    @Input() public modelAsStrings = defaults.tagInput.modelAsStrings;

    /**
     * @name trimTags
     */
    @Input() public trimTags = defaults.tagInput.trimTags;

    /**
     * @name inputText
     */
    @Input() public get inputText(): string {
        return this.inputTextValue;
    }

    /**
     * @name ripple
     */
    @Input() public ripple: boolean = defaults.tagInput.ripple;

    /**
     * @name tabindex
     * @desc pass through the specified tabindex to the input
     */
    @Input() public tabindex: string = defaults.tagInput.tabIndex;

    /**
     * @name disable
     */
    @Input() public disable: boolean = defaults.tagInput.disable;

    /**
     * @name dragZone
     */
    @Input() public dragZone: string = defaults.tagInput.dragZone;

    /**
     * @name onRemoving
     */
    @Input() public onRemoving = defaults.tagInput.onRemoving;

    /**
     * @name onAdding
     */
    @Input() public onAdding = defaults.tagInput.onAdding;

    /**
     * @name animationDuration
     */
    @Input() public animationDuration = defaults.tagInput.animationDuration;

    /**
     * @name onAdd
     * @desc event emitted when adding a new item
     */
    @Output() public onAdd = new EventEmitter<TagModel>();

    /**
     * @name onRemove
     * @desc event emitted when removing an existing item
     */
    @Output() public onRemove = new EventEmitter<TagModel>();

    /**
     * @name onSelect
     * @desc event emitted when selecting an item
     */
    @Output() public onSelect = new EventEmitter<TagModel>();

    /**
     * @name onFocus
     * @desc event emitted when the input is focused
     */
    @Output() public onFocus = new EventEmitter<string>();

    /**
     * @name onFocus
     * @desc event emitted when the input is blurred
     */
    @Output() public onBlur = new EventEmitter<string>();

    /**
     * @name onTextChange
     * @desc event emitted when the input value changes
     */
    @Output() public onTextChange = new EventEmitter<TagModel>();

    /**
     * - output triggered when text is pasted in the form
     * @name onPaste
     */
    @Output() public onPaste = new EventEmitter<string>();

    /**
     * - output triggered when tag entered is not valid
     * @name onValidationError
     */
    @Output() public onValidationError = new EventEmitter<TagModel>();

    /**
     * - output triggered when tag is edited
     * @name onTagEdited
     */
    @Output() public onTagEdited = new EventEmitter<TagModel>();

    /**
     * @name dropdown
     */
    // @ContentChild(forwardRef(() => TagInputDropdown), {static: true}) dropdown: TagInputDropdown;
    @ContentChild(TagInputDropdown) public dropdown: TagInputDropdown;
    /**
     * @name template
     * @desc reference to the template if provided by the user
     */
    @ContentChildren(TemplateRef, { descendants: false }) public templates: QueryList<TemplateRef<any>>;

    /**
     * @name inputForm
     */
    @ViewChild(TagInputForm) public inputForm: TagInputForm;

    /**
     * @name selectedTag
     * @desc reference to the current selected tag
     */
    public selectedTag: TagModel | undefined;

    /**
     * @name isLoading
     */
    public isLoading = false;

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
     */
    private listeners = {
        [constants.KEYDOWN]: <{ (fun): any }[]>[],
        [constants.KEYUP]: <{ (fun): any }[]>[]
    };

    /**
     * @description emitter for the 2-way data binding inputText value
     * @name inputTextChange
     */
    @Output() public inputTextChange: EventEmitter<string> = new EventEmitter();

    /**
     * @description private variable to bind get/set
     * @name inputTextValue
     */
    public inputTextValue = '';

    /**
     * @desc removes the tab index if it is set - it will be passed through to the input
     * @name tabindexAttr
     */
    @HostBinding('attr.tabindex')
    public get tabindexAttr(): string {
        return this.tabindex !== '' ? '-1' : '';
    }

    /**
     * @name animationMetadata
     */
    public animationMetadata: { value: string, params: object };

    public errors: string[] = [];

    public isProgressBarVisible$: Observable<boolean>;

    constructor(private readonly renderer: Renderer2,
        public readonly dragProvider: DragProvider) {
        super();
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

        const statusChanges$ = this.inputForm.form.statusChanges;

        statusChanges$.pipe(
            filter((status: string) => status !== 'PENDING')
        ).subscribe(() => {
            this.errors = this.inputForm.getErrorMessages(this.errorMessages);
        });

        this.isProgressBarVisible$ = statusChanges$.pipe(
            map((status: string) => {
                return status === 'PENDING' || this.isLoading;
            })
        );

        // if hideForm is set to true, remove the input
        if (this.hideForm) {
            this.inputForm.destroy();
        }
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

        // Setting editable to false to fix problem with tags in IE still being editable when
        // onlyFromAutocomplete is true
        this.editable = this.onlyFromAutocomplete ? false : this.editable;

        this.setAnimationMetadata();
    }

    /**
     * @name onRemoveRequested
     * @param tag
     * @param index
     */
    public onRemoveRequested(tag: TagModel, index: number): Promise<TagModel> {
        return new Promise(resolve => {
            const subscribeFn = (model: TagModel) => {
                this.removeItem(model, index);
                resolve(tag);
            };

            this.onRemoving ?
                this.onRemoving(tag)
                    .pipe(first())
                    .subscribe(subscribeFn) : subscribeFn(tag);
        });
    }

    /**
     * @name onAddingRequested
     * @param fromAutocomplete {boolean}
     * @param tag {TagModel}
     * @param index? {number}
     * @param giveupFocus? {boolean}
     */
    public onAddingRequested(fromAutocomplete: boolean, tag: TagModel,
        index?: number, giveupFocus?: boolean): Promise<TagModel> {
        return new Promise((resolve, reject) => {
            const subscribeFn = (model: TagModel) => {
                return this
                    .addItem(fromAutocomplete, model, index, giveupFocus)
                    .then(resolve)
                    .catch(reject);
            };

            return this.onAdding ?
                this.onAdding(tag)
                    .pipe(first())
                    .subscribe(subscribeFn, reject) : subscribeFn(tag);
        });
    }

    /**
     * @name appendTag
     * @param tag {TagModel}
     */
    public appendTag = (tag: TagModel, index = this.items.length): void => {
        const items = this.items;
        const model = this.modelAsStrings ? tag[this.identifyBy] : tag;

        this.items = [
            ...items.slice(0, index),
            model,
            ...items.slice(index, items.length)
        ];
    }

    /**
     * @name createTag
     * @param model
     */
    public createTag = (model: TagModel): TagModel => {
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
    public selectItem(item: TagModel | undefined, emit = true): void {
        const isReadonly = item && typeof item !== 'string' && item.readonly;

        if (isReadonly || this.selectedTag === item) {
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
        this.listeners[eventName].forEach(listener => listener.call(this, $event));
    }

    /**
     * @name handleKeydown
     * @desc handles action when the user hits a keyboard key
     * @param data
     */
    public handleKeydown(data: any): void {
        const event = data.event;
        const key = event.keyCode || event.which;
        const shiftKey = event.shiftKey || false;

        switch (constants.KEY_PRESS_ACTIONS[key]) {
            case constants.ACTIONS_KEYS.DELETE:
                if (this.selectedTag && this.removable) {
                    const index = this.items.indexOf(this.selectedTag);
                    this.onRemoveRequested(this.selectedTag, index);
                }
                break;

            case constants.ACTIONS_KEYS.SWITCH_PREV:
                this.moveToTag(data.model, constants.PREV);
                break;

            case constants.ACTIONS_KEYS.SWITCH_NEXT:
                this.moveToTag(data.model, constants.NEXT);
                break;

            case constants.ACTIONS_KEYS.TAB:
                if (shiftKey) {
                    if (this.isFirstTag(data.model)) {
                        return;
                    }

                    this.moveToTag(data.model, constants.PREV);
                } else {
                    if (this.isLastTag(data.model) && (this.disable || this.maxItemsReached)) {
                        return;
                    }

                    this.moveToTag(data.model, constants.NEXT);
                }
                break;

            default:
                return;
        }

        // prevent default behaviour
        event.preventDefault();
    }

    public async onFormSubmit() {
        try {
            await this.onAddingRequested(false, this.formValue);
        } catch {
            return;
        }
    }

    /**
     * @name setInputValue
     * @param value
     */
    public setInputValue(value: string, emitEvent = true): void {
        const control = this.getControl();

        // update form value with the transformed item
        control.setValue(value, { emitEvent });
    }

    /**
     * @name getControl
     */
    private getControl(): FormControl {
        return this.inputForm.value as FormControl;
    }

    /**
     * @name focus
     * @param applyFocus
     * @param displayAutocomplete
     */
    public focus(applyFocus = false, displayAutocomplete = false): void {
        if (this.dragProvider.getState('dragging')) {
            return;
        }

        this.selectItem(undefined, false);

        if (applyFocus) {
            this.inputForm.focus();
            this.onFocus.emit(this.formValue);
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
     */
    public hasErrors(): boolean {
        return !!this.inputForm && this.inputForm.hasErrors();
    }

    /**
     * @name isInputFocused
     */
    public isInputFocused(): boolean {
        return !!this.inputForm && this.inputForm.isInputFocused();
    }

    /**
     * - this is the one way I found to tell if the template has been passed and it is not
     * the template for the menu item
     * @name hasCustomTemplate
     */
    public hasCustomTemplate(): boolean {
        const template = this.templates ? this.templates.first : undefined;
        const menuTemplate = this.dropdown && this.dropdown.templates ?
            this.dropdown.templates.first : undefined;

        return Boolean(template && template !== menuTemplate);
    }

    /**
     * @name maxItemsReached
     */
    public get maxItemsReached(): boolean {
        return this.maxItems !== undefined &&
            this.items.length >= this.maxItems;
    }

    /**
     * @name formValue
     */
    public get formValue(): string {
        const form = this.inputForm.value;

        return form ? form.value : '';
    }

    /**3
     * @name onDragStarted
     * @param event
     * @param index
     */
    public onDragStarted(event: DragEvent, tag: TagModel, index: number): void {
        event.stopPropagation();

        const item = { zone: this.dragZone, tag, index } as DraggedTag;

        this.dragProvider.setSender(this);
        this.dragProvider.setDraggedItem(event, item);
        this.dragProvider.setState({ dragging: true, index });
    }

    /**
     * @name onDragOver
     * @param event
     */
    public onDragOver(event: DragEvent, index?: number): void {
        this.dragProvider.setState({ dropping: true });
        this.dragProvider.setReceiver(this);

        event.preventDefault();
    }

    /**
     * @name onTagDropped
     * @param event
     * @param index
     */
    public onTagDropped(event: DragEvent, index?: number): void {
        const item = this.dragProvider.getDraggedItem(event);

        if (!item || item.zone !== this.dragZone) {
            return;
        }

        this.dragProvider.onTagDropped(item.tag, item.index, index);

        event.preventDefault();
        event.stopPropagation();
    }

    /**
     * @name isDropping
     */
    public isDropping(): boolean {
        const isReceiver = this.dragProvider.receiver === this;
        const isDropping = this.dragProvider.getState('dropping');

        return Boolean(isReceiver && isDropping);
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
     * @param items
     */
    public trackBy(index: number, item: TagModel): string {
        return item[this.identifyBy];
    }

    /**
     * @name updateEditedTag
     * @param tag
     */
    public updateEditedTag({ tag, index }: { tag: TagModel, index: number }): void {
        this.onTagEdited.emit(tag);
    }

    /**
     *
     * @param tag
     * @param isFromAutocomplete
     */
    public isTagValid = (tag: TagModel, fromAutocomplete = false): boolean => {
        const selectedItem = this.dropdown ? this.dropdown.selectedItem : undefined;
        const value = this.getItemDisplay(tag).trim();

        if (selectedItem && !fromAutocomplete || !value) {
            return false;
        }

        const dupe = this.findDupe(tag, fromAutocomplete);

        // if so, give a visual cue and return false
        if (!this.allowDupes && dupe && this.blinkIfDupe) {
            const model = this.tags.find(item => {
                return this.getItemValue(item.model) === this.getItemValue(dupe);
            });

            if (model) {
                model.blink();
            }
        }

        const isFromAutocomplete = fromAutocomplete && this.onlyFromAutocomplete;

        const assertions = [
            // 1. there must be no dupe OR dupes are allowed
            !dupe || this.allowDupes,

            // 2. check max items has not been reached
            !this.maxItemsReached,

            // 3. check item comes from autocomplete or onlyFromAutocomplete is false
            ((isFromAutocomplete) || !this.onlyFromAutocomplete)
        ];

        return assertions.filter(Boolean).length === assertions.length;
    }

    /**
     * @name moveToTag
     * @param item
     * @param direction
     */
    private moveToTag(item: TagModel, direction: string): void {
        const isLast = this.isLastTag(item);
        const isFirst = this.isFirstTag(item);
        const stopSwitch = (direction === constants.NEXT && isLast) ||
            (direction === constants.PREV && isFirst);

        if (stopSwitch) {
            this.focus(true);
            return;
        }

        const offset = direction === constants.NEXT ? 1 : -1;
        const index = this.getTagIndex(item) + offset;
        const tag = this.getTagAtIndex(index);

        return tag.select.call(tag);
    }

    /**
     * @name isFirstTag
     * @param item {TagModel}
     */
    private isFirstTag(item: TagModel): boolean {
        return this.tags.first.model === item;
    }

    /**
     * @name isLastTag
     * @param item {TagModel}
     */
    private isLastTag(item: TagModel): boolean {
        return this.tags.last.model === item;
    }

    /**
     * @name getTagIndex
     * @param item
     */
    private getTagIndex(item: TagModel): number {
        const tags = this.tags.toArray();

        return tags.findIndex(tag => tag.model === item);
    }

    /**
     * @name getTagAtIndex
     * @param index
     */
    private getTagAtIndex(index: number) {
        const tags = this.tags.toArray();

        return tags[index];
    }

    /**
     * @name removeItem
     * @desc removes an item from the array of the model
     * @param tag {TagModel}
     * @param index {number}
     */
    public removeItem(tag: TagModel, index: number): void {
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
     * @param fromAutocomplete {boolean}
     * @param item {TagModel}
     * @param index? {number}
     * @param giveupFocus? {boolean}
     */
    private addItem(fromAutocomplete = false, item: TagModel, index?: number, giveupFocus?: boolean):
        Promise<TagModel> {
        const display = this.getItemDisplay(item);
        const tag = this.createTag(item);

        if (fromAutocomplete) {
            this.setInputValue(this.getItemValue(item, true));
        }

        return new Promise((resolve, reject) => {
            /**
             * @name reset
             */
            const reset = (): void => {
                // reset control and focus input
                this.setInputValue('');

                if (giveupFocus) {
                    this.focus(false, false);
                } else {
                    // focus input
                    this.focus(true, false);
                }

                resolve(display);
            };

            const appendItem = (): void => {
                this.appendTag(tag, index);

                // emit event
                this.onAdd.emit(tag);

                if (!this.dropdown) {
                    return;
                }

                this.dropdown.hide();

                if (this.dropdown.showDropdownIfEmpty) {
                    this.dropdown.show();
                }
            };

            const status = this.inputForm.form.status;
            const isTagValid = this.isTagValid(tag, fromAutocomplete);

            const onValidationError = () => {
                this.onValidationError.emit(tag);
                return reject();
            };

            if (status === 'VALID' && isTagValid) {
                appendItem();
                return reset();
            }

            if (status === 'INVALID' || !isTagValid) {
                reset();
                return onValidationError();
            }

            if (status === 'PENDING') {
                const statusUpdate$ = this.inputForm.form.statusChanges;

                return statusUpdate$
                    .pipe(
                        filter(statusUpdate => statusUpdate !== 'PENDING'),
                        first()
                    )
                    .subscribe((statusUpdate) => {
                        if (statusUpdate === 'VALID' && isTagValid) {
                            appendItem();
                            return reset();
                        } else {
                            reset();
                            return onValidationError();
                        }
                    });
            }
        });
    }

    /**
     * @name setupSeparatorKeysListener
     */
    private setupSeparatorKeysListener(): void {
        const useSeparatorKeys = this.separatorKeyCodes.length > 0 || this.separatorKeys.length > 0;
        const listener = ($event) => {
            const hasKeyCode = this.separatorKeyCodes.indexOf($event.keyCode) >= 0;
            const hasKey = this.separatorKeys.indexOf($event.key) >= 0;
            // the keyCode of keydown event is 229 when IME is processing the key event.
            const isIMEProcessing = $event.keyCode === 229;

            if (hasKeyCode || (hasKey && !isIMEProcessing)) {
                $event.preventDefault();
                this.onAddingRequested(false, this.formValue)
                    .catch(() => { });
            }
        };

        listen.call(this, constants.KEYDOWN, listener, useSeparatorKeys);
    }

    /**
     * @name setUpKeypressListeners
     */
    private setUpKeypressListeners(): void {
        const listener = ($event) => {
            const isCorrectKey = $event.keyCode === 37 || $event.keyCode === 8;

            if (isCorrectKey &&
                !this.formValue &&
                this.items.length) {
                this.tags.last.select.call(this.tags.last);
            }
        };

        // setting up the keypress listeners
        listen.call(this, constants.KEYDOWN, listener);
    }

    /**
     * @name setUpKeydownListeners
     */
    private setUpInputKeydownListeners(): void {
        this.inputForm.onKeydown.subscribe(event => {
            if (event.key === 'Backspace' && this.formValue.trim() === '') {
                event.preventDefault();
            }
        });
    }

    /**
     * @name setUpOnPasteListener
     */
    private setUpOnPasteListener() {
        const input = this.inputForm.input.nativeElement;

        // attach listener to input
        this.renderer.listen(input, 'paste', (event) => {
            this.onPasteCallback(event);

            event.preventDefault();
            return true;
        });
    }

    /**
     * @name setUpTextChangeSubscriber
     */
    private setUpTextChangeSubscriber(): void {
        this.inputForm.form
            .valueChanges
            .pipe(
                debounceTime(this.onTextChangeDebounce)
            )
            .subscribe((value: { item: string }) => {
                this.onTextChange.emit(value.item);
            });
    }

    /**
     * @name setUpOnBlurSubscriber
     */
    private setUpOnBlurSubscriber(): void {
        const filterFn = (): boolean => {
            const isVisible = this.dropdown && this.dropdown.isVisible;
            return !isVisible && !!this.formValue;
        };

        this.inputForm
            .onBlur
            .pipe(
                debounceTime(100),
                filter(filterFn)
            )
            .subscribe(() => {
                const reset = () => this.setInputValue('');

                if (this.addOnBlur) {
                    return this
                        .onAddingRequested(false, this.formValue, undefined, true)
                        .then(reset)
                        .catch(reset);
                }

                reset();
            });
    }

    /**
     * @name findDupe
     * @param tag
     * @param isFromAutocomplete
     */
    private findDupe(tag: TagModel, isFromAutocomplete: boolean): TagModel | undefined {
        const identifyBy = isFromAutocomplete ? this.dropdown.identifyBy : this.identifyBy;
        const id = tag[identifyBy];

        return this.items.find(item => this.getItemValue(item) === id);
    }

    /**
     * @name onPasteCallback
     * @param data
     */
    private onPasteCallback = async (data: ClipboardEvent) => {
        interface IEWindow extends Window {
            clipboardData: DataTransfer;
        }

        const getText = (): string => {
            const isIE = Boolean((window as IEWindow & typeof globalThis).clipboardData);
            const clipboardData = isIE ? (
                (window as IEWindow & typeof globalThis).clipboardData
            ) : data.clipboardData;
            const type = isIE ? 'Text' : 'text/plain';
            return clipboardData === null ? '' : clipboardData.getData(type) || '';
        };

        const text = getText();

        const requests = text
            .split(this.pasteSplitPattern)
            .map(item => {
                const tag = this.createTag(item);
                this.setInputValue(tag[this.displayBy]);
                return this.onAddingRequested(false, tag);
            });

        const resetInput = () => setTimeout(() => this.setInputValue(''), 50);

        Promise.all(requests).then(() => {
            this.onPaste.emit(text);
            resetInput();
        })
            .catch(resetInput);
    }

    /**
     * @name setAnimationMetadata
     */
    private setAnimationMetadata(): void {
        this.animationMetadata = {
            value: 'in',
            params: { ...this.animationDuration }
        };
    }
}
