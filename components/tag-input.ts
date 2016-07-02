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
    provide
} from '@angular/core';

import {TagInputAccessor} from './accessor';

import {
    FormGroup,
    FormControl,
    FormBuilder,
    Validators,
    NG_VALUE_ACCESSOR
} from '@angular/forms';

import {
    PLACEHOLDER,
    SECONDARY_PLACEHOLDER,
    ACTIONS,
    KEY_PRESS_ACTIONS
} from './constants';

import {
    TagInputComponent
} from './tag-input.d';

const CUSTOM_INPUT_CONTROL_VALUE_ACCESSOR = provide(NG_VALUE_ACCESSOR, {
    useExisting: forwardRef(() => TagInput),
    multi: true
});

const styles = [require('./style.scss').toString()],
    template = require('./template.html');

/**
 * A component for entering a list of terms to be used with ngModel.
 */
@Component({
    moduleId: module.id,
    selector: 'tag-input',
    directives: [],
    providers: [CUSTOM_INPUT_CONTROL_VALUE_ACCESSOR],
    styles,
    template
})
export class TagInput extends TagInputAccessor implements TagInputComponent, OnInit {
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
     * @desc if set to true, the user cannot remove/add new items
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
     * @name template
     * @desc reference to the template if provided by the user
     * @type {ElementRef}
     */
    @ViewChild('template') public template: ElementRef;

    /**
     * @name hasTemplate
     * @desc boolean that returns whether the user has specified a template or not
     */
    private hasTemplate: boolean;

    /**
     * @name tagElements
     * @desc list of Element items
     */
    private tagElements: Element[];


    // Component private/public properties


    /**
     * @name form
     * @type {ngForm}
     * @desc ngForm for handling the validation on the input text
     */
    public form: FormGroup;

    /**
     * @name input
     * @desc object representing utilities for managing the input text element
     */
    public input = {
        element: <HTMLElement>undefined,
        isFocused: <boolean>false,
        isVisible: (): boolean => {
            const maxItemsReached = this.maxItems !== undefined && this.value.length === this.maxItems;
            return !this.readonly && !maxItemsReached;
        },
        focus: (keepTagSelected = false): void => {
            if (!this.input.isVisible()) {
                return;
            }

            this.renderer.invokeElementMethod(this.input.element, 'focus', []);
            this.input.isFocused = true;
            this.select(undefined);
        }
    };

    /**
     * @name listeners
     * @desc array of events that get fired using @fireEvents
     * @type []
     */
    private listeners = {
        keyup: <{(fun): any}[]>[],
        change: <{(fun): any}[]>[]
    };

    private _selectedTag: string;

    constructor(private element: ElementRef,
                private builder: FormBuilder,
                private renderer: Renderer) {
        super();
    }

    /**
     * @name removes an item from the array of the model
     * @param item {TagComponent}
     */
    public remove(item: string): void {
        this.value = this.value.filter(_item => _item !== item);

        // if the removed tag was selected, set it as undefined
        if (this.selectedTag === item) {
            this.select(undefined);
        }

        // focus input right after removing an item
        this.input.focus.call(this);

        // emit remove event
        this.onRemove.emit(item);
    }

    /**
     * @name add
     * @desc adds the current text model to the items array
     */
    public add(): void {
        const vm = this,
            item = vm.transform(vm.form.value.item),
            control = <FormControl>vm.form.find('item');

        // update form value with the transformed item
        control.updateValue(item);

        // check if the transformed item is already existing in the list
        const isDupe = vm.value.indexOf(item) !== -1;

        // check validity
        if (!vm.input.isVisible() || !vm.form.valid || isDupe) {
            control.updateValue('');
            return;
        }

        // append item to the ngModel list
        vm.value.push(item);

        // reset control
        control.updateValue('');

        //  and emit event
        vm.onAdd.emit(item);
    }

    /**
     * @name select
     * @desc selects item passed as parameter as the selected tag
     * @param item
     */
    public select(item: string): void {
        if (this.readonly) {
            this.renderer.invokeElementMethod(this.element.nativeElement, 'focus', []);
            return;
        }

        this._selectedTag = item;

        // emit event
        this.onSelect.emit(item);
    }

    /**
     * @name selectedTag
     * @desc string representing the current tag selected
     * @type {string}
     */
    public get selectedTag(): string {
        return this._selectedTag;
    }

    public set selectedTag(tag: string) {
        this._selectedTag = tag;
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
        const vm = this,
            KEY = $event.keyCode,
            ACTION = KEY_PRESS_ACTIONS[KEY],
            itemIndex = this.value.indexOf(item);

        function deleteSelectedTag() {
            if (vm.selectedTag) {
                vm.remove(vm.selectedTag);
            }
        }

        function switchPrev() {
            if (itemIndex > 0) {
                vm.select(vm.value[itemIndex - 1]);
                vm.renderer.invokeElementMethod(vm.tagElements[itemIndex - 1], 'focus', []);
            } else {
                vm.input.focus.call(vm);
            }
        }

        function switchNext() {
            if (itemIndex < vm.value.length - 1) {
                vm.select(vm.value[itemIndex + 1]);
                vm.renderer.invokeElementMethod(vm.tagElements[itemIndex + 1], 'focus', []);
            } else {
                vm.input.focus.call(vm);
            }
        }

        switch (ACTION) {
            case ACTIONS.DELETE:
                deleteSelectedTag();
                break;
            case ACTIONS.SWITCH_PREV:
                switchPrev();
                break;
            case ACTIONS.SWITCH_NEXT:
                switchNext();
                break;
            case ACTIONS.TAB:
                switchNext();
                break;
        }
    }

    /**
     * @name setupAdditionalKeysEvents
     * @desc sets up listeners for additional separator keys and the backspace key for selecting the last item
     */
    private setupAdditionalKeysEvents(): void {
        const vm = this;

        const listener = ($event) => {
            if (vm.separatorKeys.indexOf($event.keyCode) >= 0) {
                $event.preventDefault();
                vm.add();
            }
        };

        const backSpaceListener = ($event) => {
            const itemsLength: number = vm.value.length,
                inputValue: string = vm.form.find('item').value,
                isCorrectKey = $event.keyCode === 37 || $event.keyCode === 8;

            if (isCorrectKey && !inputValue && itemsLength) {
                vm.select(vm.value[itemsLength - 1]);
                vm.renderer.invokeElementMethod(vm.tagElements[itemsLength - 1], 'focus', []);
            }
        };

        if (vm.separatorKeys.length) {
            vm.listeners.keyup.push(listener);
        }

        vm.listeners.keyup.push(backSpaceListener);
    }

    ngOnInit() {
        // setting up the keypress listeners
        this.setupAdditionalKeysEvents();

        // if the number of items specified in the model is > of the value of maxItems
        // degrade gracefully and let the max number of items to be the number of items in the model
        // though, warn the user.
        if (this.maxItems !== undefined && this.value.length > this.maxItems) {
            this.maxItems = this.value.length;
            console.warn('The number of items specified was greater than the property max-items.');
        }

        this.form = this.builder.group({
            item: new FormControl('', Validators.compose(this.validators))
        });
    }

    ngAfterViewChecked() {
        this.hasTemplate = this.template && this.template.nativeElement.childElementCount > 0;

        // if the template has been specified, remove the tags-container for the tags with default template
        // which will be replaced by <ng-content>
        if (this.hasTemplate) {
            const form = this.element.nativeElement.querySelector('form');
            const customTagsContainer = this.element.nativeElement.querySelector('.tags-container--custom');
            const defaultTagsContainer = this.element.nativeElement.querySelector('.tags-container--default');

            customTagsContainer.appendChild(form);

            if (defaultTagsContainer) {
                defaultTagsContainer.remove();
            }
        }

        // store DOM references
        this.input.element = this.element.nativeElement.querySelector('input');
        this.tagElements = this.element.nativeElement.querySelectorAll('.tag');
    }
}
