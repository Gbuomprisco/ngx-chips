import {
    Component,
    forwardRef,
    Input,
    Output,
    ElementRef,
    EventEmitter,
    Renderer,
    ViewChild,
    ViewChildren,
    ContentChildren,
    ContentChild,
    OnInit,
    HostListener,
    TemplateRef,
    QueryList
} from '@angular/core';

import {
    FormControl,
    NG_VALUE_ACCESSOR
} from '@angular/forms';

import {
    PLACEHOLDER,
    SECONDARY_PLACEHOLDER,
    KEYDOWN,
    KEYUP,
    MAX_ITEMS_WARNING
} from './helpers/constants';

import {
    backSpaceListener,
    autoCompleteListener,
    customSeparatorKeys,
    addListener,
    onAutocompleteItemClicked
} from './helpers/events-actions';

import { TagInputAccessor, TagModel } from './helpers/accessor';
import { getAction } from './helpers/keypress-actions';
import { TagInputForm } from './tag-input-form/tag-input-form.component';

import 'rxjs/add/operator/debounceTime';
import { TagInputDropdown } from './dropdown/tag-input-dropdown.component';
import { TagComponent } from './tag/tag.component';

/**
 * A component for entering a list of terms to be used with ngModel.
 */
@Component({
    selector: 'tag-input',
    providers: [ {
        provide: NG_VALUE_ACCESSOR,
        useExisting: forwardRef(() => TagInputComponent),
        multi: true
    } ],
    styleUrls: [ './tag-input.style.scss' ],
    templateUrl: './tag-input.template.html'
})
export class TagInputComponent extends TagInputAccessor implements OnInit {
    /**
     * @name separatorKeys
     * @desc keyboard keys with which a user can separate items
     * @type {Array}
     */
    @Input() public separatorKeys: number[] = [];

    /**
     * @name placeholder
     * @desc the placeholder of the input text
     * @type {string}
     */
    @Input() public placeholder: string = PLACEHOLDER;

    /**
     * @name secondaryPlaceholder
     * @desc placeholder to appear when the input is empty
     * @type {string}
     */
    @Input() public secondaryPlaceholder: string = SECONDARY_PLACEHOLDER;

    /**
     * @name maxItems
     * @desc maximum number of items that can be added
     * @type {number}
     */
    @Input() public maxItems: number = undefined;

    /**
     * @name readonly
     * @desc if set to true, the user cannot remove/addItem new items
     * @type {boolean}
     */
    @Input() public readonly: boolean = undefined;

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
    @Input() public validators = [];

    /**
     * @name autocompleteItems
     * @desc array of items that will populate the autocomplete
     * @type {Array<string>}
     */
    @Input() public autocompleteItems: string[] = undefined;

    /**
    * - if set to true, it will only possible to add items from the autocomplete
    * @name onlyFromAutocomplete
    * @type {Boolean}
    */
    @Input() public onlyFromAutocomplete: boolean = false;

	/**
     * @name errorMessages
     * @type {Map<string, string>}
     */
    @Input() public errorMessages: {[key: string]: string} = {};

    /**
     * @name theme
     * @type {string}
     */
    @Input() public theme: string = 'default';

    /**
     * - show autocomplete dropdown if the value of input is empty
     * @name showDropdownIfEmpty
     * @type {boolean}
     */
    @Input() public showDropdownIfEmpty: boolean = false;

    // outputs

    /**
     * @name onTextChangeDebounce
     * @type {number}
     */
    @Input() private onTextChangeDebounce: number = 250;

    /**
     * - custom id assigned to the input
     * @name id
     */
    @Input() private inputId: string;

    /**
     * - custom class assigned to the input
     */
    @Input() private inputClass: string;

    /**
     * - option to clear text input when the form is blurred
     * @name clearOnBlur
     */
    @Input() private clearOnBlur: string;

    /**
     * - hideForm
     * @name clearOnBlur
     */
    @Input() private hideForm: string;

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
     * @name dropdown
     */
    @ContentChild(TagInputDropdown) public dropdown: TagInputDropdown;

    /**
     * @name template
     * @desc reference to the template if provided by the user
     * @type {TemplateRef}
     */
    @ContentChildren(TemplateRef, {descendants: false}) public templates: QueryList<TemplateRef<any>>;

	/**
     * @name inputForm
     * @type {TagInputForm}
     */
    @ViewChild(TagInputForm) public inputForm: TagInputForm;

    /**
    * list of items that match the current value of the input (for autocomplete)
    * @name itemsMatching
    * @type {String[]}
    */
    public itemsMatching: string[] = [];

    /**
     * @name selectedTag
     * @desc reference to the current selected tag
     * @type {String}
     */
    public selectedTag: TagModel;

    /**
     * @name tags
     * @desc list of Element items
     */
    @ViewChildren(TagComponent) private tags: QueryList<TagComponent>;

    /**
     * @name listeners
     * @desc array of events that get fired using @fireEvents
     * @type []
     */
    private listeners = {
        [KEYDOWN]: <{(fun): any}[]>[],
        [KEYUP]: <{(fun): any}[]>[],
        change: <{(fun): any}[]>[]
    };

    constructor(private element: ElementRef, private renderer: Renderer) {
        super();
    }

    /**
     * @name removeItem
     * @desc removes an item from the array of the model
     * @param item {string}
     */
    public removeItem(item: TagModel): void {
        this.items = this.items.filter(_item => _item !== this.findItem(item.value));

        // if the removed tag was selected, set it as undefined
        if (this.selectedTag && this.selectedTag.value === item.value) {
            this.selectedTag = undefined;
        }

        // focus input right after removing an item
        this.focus(true);

        // emit remove event
        this.onRemove.emit(item);
    }

    /**
     * @name addItem
     * @desc adds the current text model to the items array
     */
    public addItem(isFromAutocomplete = false): void {
        const selectedItem = this.dropdown ? this.dropdown.selectedItem : undefined;
        if (selectedItem && !isFromAutocomplete) {
            return;
        }

        // update form value with the transformed item
        const item = this.setInputValue(this.inputForm.value.value);

        // check if the transformed item is already existing in the list
        const isDupe = !!this.findItem(item);

        // check validity:
        // 1. form must be valid
        // 2. there must be no dupe
        // 3. check max items has not been reached
        // 4. check item comes from autocomplete
        // 5. or onlyFromAutocomplete is false
        const isValid = this.inputForm.form.valid &&
            isDupe === false &&
            this.maxItemsReached === false &&
            ((isFromAutocomplete && this.onlyFromAutocomplete === true) || this.onlyFromAutocomplete === false);

        // if valid:
        if (isValid) {
            const newTag = new TagModel(item, item);

            // append item to the ngModel list
            this.items = [...this.items, newTag];

            //  and emit event
            this.onAdd.emit(newTag);
        }

        // reset control
        this.setInputValue('');
        this.focus(true);
    }

    /**
     * @name selectItem
     * @desc selects item passed as parameter as the selected tag
     * @param item
     */
    public selectItem(item: TagModel): void {
        if (this.readonly || !item || item === this.selectedTag) {
            return;
        }

        this.selectedTag = item;

        // emit event
        this.onSelect.emit(item);
    }

    /**
     * @name findItem
     * @param value
     * @returns {TagModel}
     */
    public findItem(value: string): TagModel {
        return this.items.find((item: TagModel) => item.value === value);
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
        const action = getAction(event.keyCode || event.which);

        // call action
        action.call(this, data.model);

        // prevent default behaviour
        event.preventDefault();
    }

    /**
     * @name seyInputValue
     * @param value
     * @returns {string}
     */
    private setInputValue(value: string): string {
        const item = value ? this.transform(value) : '';
        const control = this.getControl();

        // update form value with the transformed item
        control.setValue(item);

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
     */
    public focus(applyFocus = false): void {
        if (this.readonly) {
            return;
        }

        if (this.dropdown) {
            autoCompleteListener.call(this, {});
        }

        this.selectedTag = undefined;

        this.onFocus.emit(this.inputForm.value.value);

        if (applyFocus) {
            this.inputForm.focus();
        }
    }

	/**
     * @name blur
     */
    public blur(): void {
        this.onBlur.emit(this.inputForm.value.value);
    }

    /**
     * @name hasErrors
     * @returns {boolean}
     */
    public hasErrors(): boolean {
        return this.inputForm && this.inputForm.hasErrors() ? true : false;
    }

    /**
     * @name isInputFocused
     * @returns {boolean}
     */
    public isInputFocused(): boolean {
        return this.inputForm && this.inputForm.isInputFocused() ? true : false;
    }

    /**
     * - this is the one way I found to tell if the template has been passed and it is not
     * the template for the menu item
     * @name hasCustomTemplate
     */
    public hasCustomTemplate(): boolean {
        const template = this.templates ? this.templates.first : undefined;
        const menuTemplate = this.dropdown && this.dropdown.templates ? this.dropdown.templates.first : undefined;
        return template && template !== menuTemplate;
    }

	/**
     * @name maxItemsReached
     * @returns {boolean}
     */
    private get maxItemsReached(): boolean {
        return this.maxItems !== undefined && this.items.length >= this.maxItems;
    }

    /**
     * @name ngOnInit
     */
    public ngOnInit() {
        // setting up the keypress listeners
        addListener.call(this, KEYDOWN, backSpaceListener);
        addListener.call(this, KEYDOWN, customSeparatorKeys, this.separatorKeys.length > 0);

        // if the number of items specified in the model is > of the value of maxItems
        // degrade gracefully and let the max number of items to be the number of items in the model
        // though, warn the user.
        const maxItemsReached = this.maxItems !== undefined && this.items.length > this.maxItems;
        if (maxItemsReached) {
            this.maxItems = this.items.length;
            console.warn(MAX_ITEMS_WARNING);
        }
    }

    /**
     * @name ngAfterViewInit
     */
    public ngAfterViewInit() {
        this.inputForm.onKeydown.subscribe(event => {
            this.fireEvents('keydown', event);
        });

        if (this.onTextChange.observers.length) {
            this.inputForm.form.valueChanges
                .debounceTime(this.onTextChangeDebounce)
                .subscribe(() => {
                    const value = this.inputForm.value.value;
                    this.onTextChange.emit(value);
                });
        }

        // if clear on blur is set to true, subscribe to the event and clear the text's form
        if (this.clearOnBlur) {
            this.inputForm
                .onBlur
                .subscribe(() => {
                    this.setInputValue('');
                });
        }

        // if hideForm is set to true, remove the input
        if (this.hideForm) {
            this.inputForm.destroy();
        }
    }

    /**
     * @name ngAfterContentInit
     */
    public ngAfterContentInit() {
        // if dropdown is defined, set up its events
        if (this.dropdown) {
            addListener.call(this, KEYUP, autoCompleteListener);

            this.dropdown.onItemClicked().subscribe(onAutocompleteItemClicked.bind(this));

            // reset itemsMatching array when the dropdown is hidden
            this.dropdown.onHide().subscribe(() => {
                this.itemsMatching = [];
            });
        }
    }

    /**
     * @name scrollListener
     */
    @HostListener('window:scroll')
    private scrollListener(): void {
        if (this.dropdown && this.dropdown.isVisible) {
            this.dropdown.updatePosition(this.inputForm.getElementPosition());
        }
    }
}
