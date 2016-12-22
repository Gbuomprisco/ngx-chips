import {
    Component,
    forwardRef,
    Input,
    Output,
    ElementRef,
    EventEmitter,
    Renderer,
    ViewChild,
    OnInit,
    HostListener
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
    MAX_ITEMS_WARNING,
    FOCUS
} from './helpers/constants';

import {
    backSpaceListener,
    autoCompleteListener,
    customSeparatorKeys,
    addListener,
    onAutocompleteItemClicked
} from './helpers/events-actions';

import { Ng2Dropdown } from 'ng2-material-dropdown';
import { TagInputAccessor } from './helpers/accessor';
import { getAction } from './helpers/keypress-actions';
import { TagInputForm } from './tag-input-form/tag-input-form.component';

import 'rxjs/add/operator/debounceTime';

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
     * @name autocomplete
     * @desc sets if autocomplete is enabled. By default it's not.
     * @type {boolean}
     */
    @Input() public autocomplete: boolean = false;

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
     * @name onAdd
     * @desc event emitted when adding a new item
     * @type {EventEmitter<string>}
     */
    @Output() public onAdd = new EventEmitter<string>();

    /**
     * @name onRemove
     * @desc event emitted when removing an existing item
     * @type {EventEmitter<string>}
     */
    @Output() public onRemove = new EventEmitter<string>();

    /**
     * @name onSelect
     * @desc event emitted when selecting an item
     * @type {EventEmitter<string>}
     */
    @Output() public onSelect = new EventEmitter<string>();

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
    @Output() public onTextChange = new EventEmitter<string>();

    /**
     * @name template
     * @desc reference to the template if provided by the user
     * @type {ElementRef}
     */
    @ViewChild('template') public template: ElementRef;

    /**
     * @name dropdown
     */
    @ViewChild(Ng2Dropdown) public dropdown: Ng2Dropdown;

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
    public selectedTag: string;

    /**
     * @name tagElements
     * @desc list of Element items
     */
    private tagElements: Element[];

    // Component private/public properties

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
    public removeItem(item: string): void {
        this.items = this.items.filter(_item => _item !== item);

        // if the removed tag was selected, set it as undefined
        if (this.selectedTag === item) {
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
        const selectedItem = this.dropdown.menu.state.dropdownState.selectedItem;
        if (this.autocomplete && selectedItem && !isFromAutocomplete) {
            return;
        }

        // update form value with the transformed item
        const item = this.setInputValue(this.inputForm.value.value);

        // check if the transformed item is already existing in the list
        const isDupe = this.items.indexOf(item) !== -1;

        // check validity:
        // 1. form must be valid
        // 2. there must be no dupe
        // 3. check max items has not been reached
        // 4. check item comes from autocomplete
        // 5. or onlyFromAutocomplete is false
        const isValid = this.inputForm.form.valid &&
            isDupe === false &&
            !this.maxItemsReached &&
            ((isFromAutocomplete && this.onlyFromAutocomplete === true) || this.onlyFromAutocomplete === false);

        // if valid:
        if (isValid) {
            // append item to the ngModel list
            this.items = [...this.items, item];

            //  and emit event
            this.onAdd.emit(item);
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
    public selectItem(item: string): void {
        if (this.readonly) {
            const el = this.element.nativeElement;
            this.renderer.invokeElementMethod(el, FOCUS, []);
            return;
        }

        this.selectedTag = item;

        // emit event
        this.onSelect.emit(item);
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
     * @param $event
     * @param item
     */
    public handleKeydown($event, item: string): void {
        const action = getAction($event.keyCode || $event.which);
        const itemIndex = this.items.indexOf(item);

        // call action
        action.call(this, itemIndex);
        // prevent default behaviour
        $event.preventDefault();
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

        if (this.autocomplete) {
            autoCompleteListener.call(this, {});
        }

        this.selectItem(undefined);

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
     * @name maxItemsReached
     * @returns {boolean}
     */
    private get maxItemsReached(): boolean {
        return this.maxItems !== undefined && this.items.length >= this.maxItems;
    }

	/**
     * @name hasCustomTemplate
     * @returns {boolean}
     */
    private hasCustomTemplate(): boolean {
        if (!this.template.nativeElement) {
            return false;
        }

        return this.template.nativeElement.children.length > 0;
    }

    ngOnInit() {
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

    ngAfterViewChecked() {
        this.tagElements = this.element.nativeElement.querySelectorAll('.ng2-tag');
    }

    ngAfterViewInit() {
        // if autocomplete is set to true, set up its events
        if (this.autocomplete) {
            addListener.call(this, KEYUP, autoCompleteListener);

            this.dropdown.onItemClicked.subscribe(onAutocompleteItemClicked.bind(this));
            this.dropdown.onHide.subscribe(() => this.itemsMatching = []);
        }

        this.inputForm.onKeydown.subscribe(event => {
            this.fireEvents('keydown', event);
        });

        this.inputForm.form.valueChanges
            .debounceTime(this.onTextChangeDebounce)
            .subscribe(() => {
                const value = this.inputForm.value.value;
                this.onTextChange.emit(value);
            });
    }

    @HostListener('window:scroll')
    private scrollListener() {
        const isVisible = this.dropdown.menu.state.menuState.isVisible;
        if (this.dropdown && isVisible) {
            this.dropdown.menu.updatePosition(this.inputForm.getElementPosition());
        }
    }
}
