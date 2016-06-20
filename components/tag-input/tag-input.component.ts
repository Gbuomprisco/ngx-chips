/// <reference path='../ng2-tag-input.d.ts'/>

import {
    Component,
    Provider,
    forwardRef,
    Input,
    Output,
    ElementRef,
    ChangeDetectionStrategy,
    EventEmitter,
    Renderer
} from '@angular/core';

import {
    PLACEHOLDER,
    SECONDARY_PLACEHOLDER,
    ACTIONS,
    KEY_PRESS_ACTIONS
} from './tag-input.constants';

import {NG_VALUE_ACCESSOR} from '@angular/common';
import {Tag} from '../tag/tag.component';
import {TagInputAccessor} from './tag-input-accessor';

const CUSTOM_INPUT_CONTROL_VALUE_ACCESSOR = new Provider(NG_VALUE_ACCESSOR, {
    useExisting: forwardRef(() => TagInput),
    multi: true
});

/**
 * A component for entering a list of terms to be used with ngModel.
 */
@Component({
    moduleId: module.id,
    selector: 'tag-input',
    directives: [Tag],
    providers: [CUSTOM_INPUT_CONTROL_VALUE_ACCESSOR],
    styles: [require('./tag-input.style.scss').toString()],
    template: require('./tag-input.template.html'),
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class TagInput extends TagInputAccessor implements TagInputComponent {
    /**
     * @name separatorKeys
     * @desc keyboard keys with which a user can separate items
     * @type {Array}
     */
    @Input() separatorKeys: number[] = [];

    /**
     * @name placeholder
     * @desc the placeholder of the input text
     * @type {string}
     */
    @Input() placeholder: string = PLACEHOLDER;

    /**
     * @name secondaryPlaceholder
     * @desc placeholder to appear when the input is empty
     * @type {string}
     */
    @Input() secondaryPlaceholder: string = SECONDARY_PLACEHOLDER;

    /**
     * @name maxItems
     * @desc maximum number of items that can be added
     * @type {number}
     */
    @Input() maxItems: number = undefined;

    /**
     * @name readonly
     * @desc if set to true, the user cannot remove/add new items
     * @type {boolean}
     */
    @Input() readonly: boolean = undefined;

    /**
     * @name transform
     * @desc function passed to the component to transform the value of the items, or reject them instead
     */
    @Input() transform: (item: string) => string = (item) => item;

    /**
     * @name onAdd
     * @desc event emitted when adding a new item
     * @type {EventEmitter<string>}
     */
    @Output() onAdd = new EventEmitter<string>();

    /**
     * @name onRemove
     * @desc event emitted when removing an existing item
     * @type {EventEmitter<string>}
     */
    @Output() onRemove = new EventEmitter<string>();

    /**
     * @name onSelect
     * @desc event emitted when selecting an item
     * @type {EventEmitter<string>}
     */
    @Output() onSelect = new EventEmitter<string>();

    // Component private/public properties

    /**
     * @name model
     * @desc value of the input text
     * @type {{value: string, reset: (function(): undefined)}}
     */
    public model = {
        value: <string>undefined,
        reset() {
            this.value = '';
        }
    };

    /**
     * @name selectedTag
     * @desc string representing the current tag selected
     * @type {undefined}
     */
    public selectedTag: string = undefined;

    /**
     * @name input
     * @desc object representing utilities for managing the input text element
     */
    public input = {
        element: <HTMLElement>undefined,
        isFocused: <boolean>false,
        isVisible: () => {
            const maxItemsReached = this.maxItems !== undefined && this.value.length === this.maxItems;
            return !this.readonly && !maxItemsReached;
        },
        focus: () => {
            this.input.isFocused = true;
            this.renderer.invokeElementMethod(this.input.element, 'focus', []);
            this.selectedTag = undefined;
        }
    };

    /**
     * @name getTagElements
     * @desc gets list of <tag> elements
     * @returns {any[]|NodeListOf<Element>}
     */
    private getTagElements(): HTMLElement[] {
        return this.element.nativeElement.querySelectorAll('tag');
    }

    /**
     * @name listeners
     * @desc array of events that get fired using @fireEvents
     * @type []
     */
    private listeners = {
        keyup: <{(fun): any}[]>[],
        change: <{(fun): any}[]>[]
    };

    constructor(private element: ElementRef,
                private renderer: Renderer) {
        super();
    }

    /**
     * @name removes an item from the array of the model
     * @param item {string}
     */
    public remove(item: string): void {
        this.value = this.value.filter(_item => _item !== item);

        if (this.selectedTag === item) {
            this.selectedTag = undefined;
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
        const transform = this.transform,
            itemValue = this.model.value,
            item = transform(itemValue),
            isDupe = this.value.indexOf(item) !== -1;

        // check validity
        if (!this.input.isVisible() || !item || isDupe) {
            return;
        }

        // append item to the ngModel list
        this.value.push(item);

        // reset input and emit event
        this.model.reset();
        this.onAdd.emit(item);
    }

    /**
     * @name select
     * @desc selects item passed as parameter as the selected tag
     * @param item
     */
    public select(item: string): void {
        this.selectedTag = item;
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
        const vm = this,
            KEY = $event.keyCode,
            ACTION = KEY_PRESS_ACTIONS[KEY],
            itemIndex = this.value.indexOf(item),
            tagElements = this.getTagElements();

        function deleteSelectedTag() {
            if (vm.selectedTag) {
                vm.remove(item);
            }
        }

        function switchPrev() {
            if (itemIndex > 0) {
                vm.select(vm.value[itemIndex - 1]);
                vm.renderer.invokeElementMethod(tagElements[itemIndex - 1], 'focus', []);
            } else {
                vm.input.focus();
            }
        }

        function switchNext() {
            if (itemIndex < vm.value.length - 1) {
                vm.select(vm.value[itemIndex + 1]);
                vm.renderer.invokeElementMethod(tagElements[itemIndex + 1], 'focus', []);
            } else {
                vm.input.focus();
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

        $event.preventDefault();
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
            const itemsLength = vm.value.length;
            if ($event.keyCode === 37 || $event.keyCode === 8 && itemsLength) {
                vm.select(vm.value[itemsLength - 1]);
                vm.renderer.invokeElementMethod(vm.getTagElements()[itemsLength - 1], 'focus', []);
            }
        };

        if (vm.separatorKeys.length) {
            vm.listeners.keyup.push(listener);
        }

        vm.listeners.keyup.push(backSpaceListener);
    }

    ngOnInit() {
        this.setupAdditionalKeysEvents();

        // if the number of items specified in the model is > of the value of maxItems
        // degrade gracefully and let the max number of items to be the number of items in the model
        // though, warn the user.
        if (this.maxItems !== undefined && this.value.length > this.maxItems) {
            this.maxItems = this.value.length;
            console.warn('The number of items specified was greater than the property max-items.');
        }
     }

    ngAfterViewInit() {
        this.input.element = this.element.nativeElement.querySelector('input');
    }
}
