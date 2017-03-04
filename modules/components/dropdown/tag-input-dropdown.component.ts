import {
    Component,
    ViewChild,
    forwardRef,
    Inject,
    TemplateRef,
    ContentChildren,
    Input,
    QueryList,
    HostListener
} from '@angular/core';

import { TagInputComponent } from '../tag-input';
import { Ng2Dropdown, Ng2MenuItem } from 'ng2-material-dropdown';
import { EventEmitter } from '@angular/core';
import { TagModel } from '../helpers/accessor';
import { Observable } from 'rxjs/Observable';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/filter';

@Component({
    selector: 'tag-input-dropdown',
    templateUrl: './tag-input-dropdown.template.html'
})
export class TagInputDropdown {
    /**
     * @name dropdown
     */
    @ViewChild(Ng2Dropdown) public dropdown: Ng2Dropdown;

    /**
     * @name menuTemplate
     * @desc reference to the template if provided by the user
     * @type {TemplateRef}
     */
    @ContentChildren(TemplateRef) public templates: QueryList<TemplateRef<any>>;

    /**
     * @name offset
     * @type {string}
     */
    @Input() public offset = '50 0';

    /**
     * @name focusFirstElement
     * @type {boolean}
     */
    @Input() public focusFirstElement = false;

    /**
     * - show autocomplete dropdown if the value of input is empty
     * @name showDropdownIfEmpty
     * @type {boolean}
     */
    @Input() public showDropdownIfEmpty = false;

    /**
     * @description observable passed as input which populates the autocomplete items
     * @name autocompleteObservable
     */
    @Input() public autocompleteObservable: (text: string) => Observable<any>;

    /**
     * - desc minimum text length in order to display the autocomplete dropdown
     * @name minimumTextLength
     */
    @Input() public minimumTextLength = 1;

    /**
     * - number of items to display in the autocomplete dropdown
     * @name limitItemsTo
     */
    @Input() public limitItemsTo: number;

    /**
     * @name displayBy
     */
    @Input() public displayBy = 'display';

    /**
     * @name identifyBy
     */
    @Input() public identifyBy = 'value';

    /**
     * @description a function a developer can use to implement custom matching for the autocomplete
     * @name matchingFn
     */
    @Input() public matchingFn: (value: string, target: TagModel) => boolean =
         (value: string, target: TagModel): boolean => {
            const targetValue = target[this.displayBy].toString();

            return targetValue && targetValue
                .toLowerCase()
                .indexOf(value.toLowerCase()) >= 0;
    }

    /**
     * @name appendToBody
     * @type {boolean}
     */
    @Input() public appendToBody = true;

    /**
     * list of items that match the current value of the input (for autocomplete)
     * @name items
     * @type {TagModel[]}
     */
    private items: TagModel[] = [];

    /**
     * @name _autocompleteItems
     * @type {Array}
     * @private
     */
    private _autocompleteItems: TagModel[] = [];

    /**
     * @name autocompleteItems
     * @param items
     */
    public set autocompleteItems(items: TagModel[]) {
        this._autocompleteItems = items;
    }

    /**
     * @name autocompleteItems
     * @desc array of items that will populate the autocomplete
     * @type {Array<string>}
     */
    @Input() public get autocompleteItems(): TagModel[] {
        return this._autocompleteItems ? this._autocompleteItems.map((item: TagModel) => {
            return typeof item !== 'string' ? item : {[this.displayBy]: item, [this.identifyBy]: item};
        }) : [];
    }

    constructor(@Inject(forwardRef(() => TagInputComponent)) private tagInput: TagInputComponent) {}

    public ngOnInit() {
        this.onItemClicked()
            .subscribe(this.addNewItem.bind(this));

        // reset itemsMatching array when the dropdown is hidden
        this.onHide()
            .subscribe(this.resetItems.bind(this));

        this.tagInput.inputForm.onKeyup
            .subscribe(this.show.bind(this));

        if (this.autocompleteObservable) {
            this.tagInput
                .onTextChange
                .filter((text: string) => !!text.trim().length)
                .subscribe(this.getItemsFromObservable.bind(this));
        }
    }

    /**
     * @name updatePosition
     * @param position
     */
    public updatePosition(position) {
        return this.dropdown.menu.updatePosition(position);
    }

    /**
     * @name isVisible
     * @returns {boolean}
     */
    public get isVisible(): boolean {
        return this.dropdown.menu.state.menuState.isVisible;
    }

    /**
     * @name onHide
     * @returns {EventEmitter<Ng2Dropdown>}
     */
    public onHide(): EventEmitter<Ng2Dropdown> {
        return this.dropdown.onHide;
    }

    /**
     * @name onItemClicked
     * @returns {EventEmitter<string>}
     */
    public onItemClicked(): EventEmitter<string> {
        return this.dropdown.onItemClicked;
    }

    /**
     * @name selectedItem
     * @returns {Ng2MenuItem}
     */
    public get selectedItem(): Ng2MenuItem {
        return this.dropdown.menu.state.dropdownState.selectedItem;
    }

    /**
     * @name state
     * @returns {DropdownStateService}
     */
    public get state(): any {
        return this.dropdown.menu.state;
    }

    /**
     * @name addNewItem
     * @param item {Ng2MenuItem}
     */
    private addNewItem(item: Ng2MenuItem): void {
        if (!item) {
            return;
        }

        // add item
        if (this.tagInput.isTagValid(item.value, true)) {
            const tag = this.tagInput.createTag(item.value[this.displayBy], item.value[this.identifyBy]);
            this.tagInput.appendNewTag(tag);
        }

        // reset input value
        this.tagInput.setInputValue('');

        // hide dropdown
        this.dropdown.hide();

        setTimeout(() => this.tagInput.inputForm.focus(), 0);
    }

    /**
     *
     * @name show
     */
    public show(): void {
        const value: string = this.tagInput.inputForm.value.value.trim();
        const position: ClientRect = this.tagInput.inputForm.getElementPosition();
        const items: TagModel[] = this.getMatchingItems(value);
        const hasItems: boolean = items.length > 0;
        const showDropdownIfEmpty: boolean = this.showDropdownIfEmpty && hasItems && !value;
        const hasMinimumText: boolean = value.length >= this.minimumTextLength;

        const assertions: boolean[] = [
            hasItems,
            this.isVisible === false,
            hasMinimumText
        ];

        const showDropdown: boolean = (assertions.filter(item => item).length === assertions.length) ||
            showDropdownIfEmpty;
        const hideDropdown: boolean = this.isVisible && (!hasItems || !hasMinimumText);

        // set items
        this.setItems(items);

        if (showDropdown) {
            this.dropdown.show(position);
        } else if (hideDropdown) {
            this.dropdown.hide();
        }
    }

    /**
     *
     * @param value
     * @returns {any}
     */
    private getMatchingItems(value: string): TagModel[] {
        if (!value && !this.showDropdownIfEmpty) {
            return [];
        }

        return this.autocompleteItems.filter((item: TagModel) => {
            const hasValue: boolean = this.tagInput.tags.filter(tag => {
                return tag.model[this.tagInput.displayBy] === item[this.displayBy];
            }).length > 0;

            return this.matchingFn(value, item) && hasValue === false;
        });
    }

    /**
     * @name setItems
     */
    private setItems(items: TagModel[]): void {
        this.items = items.slice(0, this.limitItemsTo || items.length);
    }

    /**
     * @name resetItems
     */
    private resetItems(): void {
        this.items = [];
    }

    /**
     * @name scrollListener
     */
    @HostListener('window:scroll')
    private scrollListener(): void {
        if (!this.isVisible) {
            return;
        }

        this.updatePosition(this.tagInput.inputForm.getElementPosition());
    }

    /**
     * @name populateItems
     * @param data
     */
    private populateItems(data: any): void {
        this.autocompleteItems = data.map(item => {
            return typeof item === 'string' ? { [this.displayBy]: item, [this.identifyBy]: item } : item;
        });
    }

    /**
     * @name getItemsFromObservable
     * @param text
     */
    private getItemsFromObservable(text: string): void {
        this.tagInput.isLoading = true;

        this.autocompleteObservable(text)
            .subscribe(data => {
                this.tagInput.isLoading = false;

                // add items
                this.populateItems(data);

                // show dropdown
                this.show();
            }, () => {
                this.tagInput.isLoading = false;
            });
    }
}
