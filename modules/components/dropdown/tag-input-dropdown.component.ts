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
import { AutocompleteItemModel } from '../helpers/accessor';

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
    @Input() public set autocompleteItems(items: AutocompleteItemModel[]) {
        this._autocompleteItems = items ? items.map((item: AutocompleteItemModel | string) => {
            if (typeof item === 'string') {
                return new AutocompleteItemModel(item, item);
            } else {
                return new AutocompleteItemModel(item.display, item.value);
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
     * list of items that match the current value of the input (for autocomplete)
     * @name items
     * @type {AutocompleteItemModel[]}
     */
    private items: AutocompleteItemModel[] = [];

    /**
     * @name _autocompleteItems
     * @type {Array}
     * @private
     */
    private _autocompleteItems: AutocompleteItemModel[] = [];

    /**
     * @name autocompleteItems
     * @desc array of items that will populate the autocomplete
     * @type {Array<string>}
     */
    public get autocompleteItems(): AutocompleteItemModel[] {
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

        const value = item.value.display;

        // add item
        if (this.tagInput.isTagValid(value, true)) {
            this.tagInput.appendNewTag(value);
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
        const value: string = this.tagInput.inputForm.value.value;
        const position: ClientRect = this.tagInput.inputForm.getElementPosition();
        const items = this.getMatchingItems(value);
        const hasItems = items.length > 0;
        const showDropdownIfEmpty = this.showDropdownIfEmpty && !value && this.autocompleteItems.length;

        this.items = items;

        if ((hasItems || showDropdownIfEmpty) && !this.isVisible) {
            this.dropdown.toggleMenu(position);
        } else if (!hasItems && this.isVisible) {
            this.dropdown.hide();
        }
    }

    /**
     *
     * @param value
     * @returns {any}
     */
    private getMatchingItems(value: string): AutocompleteItemModel[] {
        if (!value && !this.showDropdownIfEmpty) {
            return [];
        }

        return this.autocompleteItems.filter(item => {
            const matchesValue = item.display.toLowerCase().indexOf(value.toLowerCase()) >= 0;
            const hasValue = !!this.tagInput.findItem(item.display);
            return (matchesValue === true) && (hasValue === false);
        });
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
}
