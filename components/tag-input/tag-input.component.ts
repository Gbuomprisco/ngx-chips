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
    Renderer,
    ViewChildren,
    QueryList
} from '@angular/core';

import {
    Validators,
    Control,
    ControlGroup,
    FormBuilder
} from '@angular/common';

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
     *
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
     * @name tags
     * @desc array representing the tag components
     * @type {QueryList<Tag>}
     */
    @ViewChildren(Tag) private tags: QueryList<Tag>;

    // Component private/public properties

    /**
     * @name form
     * @type {Form}
     * @desc ngForm
     */

    public form: ControlGroup;

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

            if (this.selectedTag) {
                this.selectedTag.unselect();
            }
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

    constructor(private element: ElementRef,
                private builder: FormBuilder,
                private renderer: Renderer) {
        super();
    }

    /**
     * @name removes an item from the array of the model
     * @param tag {TagComponent}
     */
    public remove(tag: TagComponent): void {
        this.value = this.value.filter(_item => _item !== tag.item);

        if (this.selectedTag && this.selectedTag.item === tag.item) {
            this.selectedTag.unselect();
        }

        // focus input right after removing an item
        this.input.focus.call(this);

        // emit remove event
        this.onRemove.emit(tag.item);
    }

    /**
     * @name add
     * @desc adds the current text model to the items array
     */
    public add(): void {
        const vm = this,
            item = vm.transform(vm.form.value.item),
            control = <Control>vm.form.find('item');

        control.updateValue(item);
        const isDupe = vm.value.indexOf(item) !== -1;

        // check validity
        if (!vm.input.isVisible() || !vm.form.valid || isDupe) {
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
        const tags: Tag[] = this.tags.toArray();

        // deselect tag
        if (this.selectedTag) {
            this.selectedTag.unselect();
        }

        // activate selected tag
        tags.filter(_tag => _tag.item === item)[0].select();

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
        const vm = this,
            KEY = $event.keyCode,
            ACTION = KEY_PRESS_ACTIONS[KEY],
            itemIndex = this.value.indexOf(item),
            tags = this.tags.toArray();

        function deleteSelectedTag() {
            if (vm.selectedTag) {
                vm.remove(vm.selectedTag);
            }
        }

        function switchPrev() {
            if (itemIndex > 0) {
                vm.select(vm.value[itemIndex - 1]);
                tags[itemIndex - 1].focus();
            } else {
                vm.input.focus.call(vm);
            }
        }

        function switchNext() {
            if (itemIndex < vm.value.length - 1) {
                vm.select(vm.value[itemIndex + 1]);
                tags[itemIndex + 1].focus();
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

        $event.preventDefault();
    }

    /**
     * @name selectedTag
     * @desc string representing the current tag selected
     * @type {Tag}
     */
    private get selectedTag(): Tag {
        return this.tags.toArray().filter(_tag => _tag.isSelected)[0];
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
            const itemsLength = vm.value.length,
                inputValue = vm.form.find('item').value,
                isCorrectKey = $event.keyCode === 37 || $event.keyCode === 8;

            if (isCorrectKey && itemsLength && !inputValue) {
                vm.select(vm.value[itemsLength - 1]);
                this.tags.last.focus();
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

        this.form = this.builder.group({
            item: new Control('', Validators.compose(this.validators))
        });
     }

    ngAfterViewChecked() {
        this.input.element = this.element.nativeElement.querySelector('input');
    }
}
