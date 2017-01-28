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
    @ViewChild(Ng2Dropdown) dropdown: Ng2Dropdown;

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
    @Input() public offset: string = '50 0';

    /**
     * @name focusFirstElement
     * @type {boolean}
     */
    @Input() public focusFirstElement: boolean = false;

    /**
     * @name autocompleteItems
     * @param items
     */
    @Input() public set autocompleteItems(items: TagModel[]) {
        this._autocompleteItems = items ? items.map((item: TagModel | string) => {
            if (typeof item === 'string') {
                return {display: item, value: item};
            } else {
                return item;
            }
        }) : [];
    }

    /**
     * - show autocomplete dropdown if the value of input is empty
     * @name showDropdownIfEmpty
     * @type {boolean}
     */
    @Input() public showDropdownIfEmpty: boolean = false;

    /**
     * @description observable passed as input which populates the autocomplete items
     * @name autocompleteObservable
     */
    @Input() public autocompleteObservable: (text: string) => Observable<any>;

    /**
     * - desc minimum text length in order to display the autocomplete dropdown
     * @name minimumTextLength
     */
    @Input() private minimumTextLength: number = 1;

    /**
     * - number of items to display in the autocomplete dropdown
     * @name limitItemsTo
     */
    @Input() private limitItemsTo: number;

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
     * @desc array of items that will populate the autocomplete
     * @type {Array<string>}
     */
    public get autocompleteItems(): TagModel[] {
        return this._autocompleteItems;
    }

    constructor(@Inject(forwardRef(() => TagInputComponent)) private tagInput: TagInputComponent) {}

    public ngOnInit() {
        this.onItemClicked().subscribe(item => {
            this.addNewItem(item);
        });

        // reset itemsMatching array when the dropdown is hidden
        this.onHide().subscribe(() => {
            this.resetItems();
        });

        this.tagInput.inputForm.onKeyup.subscribe(() => {
            this.show();
        });

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
     * @param item
     */
    private addNewItem(item): void {
        if (!item) {
            return;
        }

        // add item
        if (this.tagInput.isTagValid(item.value, true)) {
            this.tagInput.appendNewTag(item.value);
        }

        this.tagInput.setInputValue('');

        setTimeout(() => this.tagInput.inputForm.focus(), 0);

        // hide dropdown
        this.dropdown.hide();
    }

    /**
     *
     * @name show
     */
    public show(): void {
        const value: string = this.tagInput.inputForm.value.value.trim();
        const position: ClientRect = this.tagInput.inputForm.getElementPosition();
        const items = this.getMatchingItems(value);
        const hasItems = items.length > 0;
        const showDropdownIfEmpty = this.showDropdownIfEmpty && !value && hasItems;
        const hasMinimumText: boolean = value.length >= this.minimumTextLength;

        const showDropdown: boolean = [
            hasItems || showDropdownIfEmpty,
            this.isVisible === false,
            hasMinimumText
        ].filter(item => item).length === 3;

        const hideDropdown: boolean = this.isVisible && (!hasItems || !hasMinimumText);

        // set items
        this.setItems(items);

        if (showDropdown) {
            this.dropdown.toggleMenu(position);
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

        const matchesFn = (item: string): boolean => {
            return item && item.toString()
                    .toLowerCase()
                    .indexOf(value.toLowerCase()) >= 0 || false;
        };

        const matchesValue = (item: TagModel): boolean => {
            return typeof item === 'string' ?
                matchesFn(item) :
                matchesFn(item[this.tagInput.displayBy]) || matchesFn(item[this.tagInput.identifyBy]);
        };

        return this.autocompleteItems.filter(item => {
            const hasValue = !!this.tagInput.tags.find(tag => tag.model === item);
            return (matchesValue(item) === true) && (hasValue === false);
        });
    }

    /**
     * @name setItems
     */
    private setItems(items: TagModel[]) {
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
            return typeof item === 'string' ? { display: item, value: item } : item;
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
                this.populateItems(data);
                this.show();
            });
    }
}
