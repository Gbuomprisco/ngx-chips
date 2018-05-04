import {
    Component,
    ContentChildren,
    EventEmitter,
    forwardRef,
    HostListener,
    Injector,
    Input,
    QueryList,
    TemplateRef,
    Type,
    ViewChild,
} from '@angular/core';

// rx
import { Observable } from 'rxjs';
import { map, filter, first, debounceTime } from 'rxjs/operators';

import { Ng2Dropdown, Ng2MenuItem } from 'ng2-material-dropdown';
import { OptionsProvider } from '../../core/providers/options-provider';
import { TagInputComponent } from '../tag-input/tag-input';
import { TagInputDropdownOptions } from '../../defaults';
import { TagModel } from '../../core/accessor';

const defaults: Type<TagInputDropdownOptions> = forwardRef(() => OptionsProvider.defaults.dropdown);

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
     */
    @ContentChildren(TemplateRef) public templates: QueryList<TemplateRef<any>>;

    /**
     * @name offset
     */
    @Input() public offset: string = new defaults().offset;

    /**
     * @name focusFirstElement
     */
    @Input() public focusFirstElement = new defaults().focusFirstElement;

    /**
     * - show autocomplete dropdown if the value of input is empty
     * @name showDropdownIfEmpty
     */
    @Input() public showDropdownIfEmpty = new defaults().showDropdownIfEmpty;

    /**
     * @description observable passed as input which populates the autocomplete items
     * @name autocompleteObservable
     */
    @Input() public autocompleteObservable: (text: string) => Observable<any>;

    /**
     * - desc minimum text length in order to display the autocomplete dropdown
     * @name minimumTextLength
     */
    @Input() public minimumTextLength = new defaults().minimumTextLength;

    /**
     * - number of items to display in the autocomplete dropdown
     * @name limitItemsTo
     */
    @Input() public limitItemsTo: number = new defaults().limitItemsTo;

    /**
     * @name displayBy
     */
    @Input() public displayBy = new defaults().displayBy;

    /**
     * @name identifyBy
     */
    @Input() public identifyBy = new defaults().identifyBy;

    /**
     * @description a function a developer can use to implement custom matching for the autocomplete
     * @name matchingFn
     */
    @Input() public matchingFn: (value: string, target: TagModel) => boolean = new defaults().matchingFn;

    /**
     * @name appendToBody
     */
    @Input() public appendToBody = new defaults().appendToBody;

    /**
     * @name keepOpen
     * @description option to leave dropdown open when adding a new item
     */
    @Input() public keepOpen = new defaults().keepOpen;

    /**
     * @name dynamicUpdate
     */
    @Input() public dynamicUpdate = new defaults().dynamicUpdate;

    /**
    * @name zIndex
     */
    @Input() public zIndex = new defaults().zIndex;

    /**
     * list of items that match the current value of the input (for autocomplete)
     * @name items
     */
    public items: TagModel[] = [];

    /**
     * @name tagInput
     */
    public tagInput: TagInputComponent = this.injector.get(TagInputComponent);

    /**
     * @name _autocompleteItems
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
     */
    @Input() public get autocompleteItems(): TagModel[] {
        const items = this._autocompleteItems;

        if (!items) {
            return [];
        }

        return items.map((item: TagModel) => {
            return typeof item === 'string' ? {
                [this.displayBy]: item,
                [this.identifyBy]: item
            } : item;
        });
    }

    constructor(private readonly injector: Injector) {}

    /**
     * @name ngOnInit
     */
    public ngOnInit(): void {
        this.onItemClicked().subscribe((item: Ng2MenuItem) => {
            this.requestAdding(item);
        });

        // reset itemsMatching array when the dropdown is hidden
        this.onHide().subscribe(this.resetItems);

        const DEBOUNCE_TIME = 200;
        const KEEP_OPEN = this.keepOpen;

        this.tagInput
            .onTextChange
            .asObservable()
            .pipe(
                debounceTime(DEBOUNCE_TIME),
                filter((value: string) => {
                    if (KEEP_OPEN === false) {
                        return value.length > 0;
                    }

                    return true;
                })
            )
            .subscribe(this.show);
    }

    /**
     * @name updatePosition
     */
    public updatePosition(): void {
        const position = this.tagInput.inputForm.getElementPosition();

        this.dropdown.menu.updatePosition(position, this.dynamicUpdate);
    }

    /**
     * @name isVisible
     */
    public get isVisible(): boolean {
        return this.dropdown.menu.state.menuState.isVisible;
    }

    /**
     * @name onHide
     */
    public onHide(): EventEmitter<Ng2Dropdown> {
        return this.dropdown.onHide;
    }

    /**
     * @name onItemClicked
     */
    public onItemClicked(): EventEmitter<string> {
        return this.dropdown.onItemClicked;
    }

    /**
     * @name selectedItem
     */
    public get selectedItem(): Ng2MenuItem {
        return this.dropdown.menu.state.dropdownState.selectedItem;
    }

    /**
     * @name state
     */
    public get state(): any {
        return this.dropdown.menu.state;
    }

    /**
     *
     * @name show
     */
    public show = (): void => {
        const maxItemsReached = this.tagInput.items.length === this.tagInput.maxItems;
        const value = this.getFormValue();
        const hasMinimumText = value.trim().length >= this.minimumTextLength;
        const position = this.calculatePosition();
        const items = this.getMatchingItems(value);
        const hasItems = items.length > 0;
        const isHidden = this.isVisible === false;
        const showDropdownIfEmpty = this.showDropdownIfEmpty && hasItems && !value;
        const isDisabled = this.tagInput.disable;
        const assertions = [];

        const shouldShow = isHidden && ((hasItems && hasMinimumText) || showDropdownIfEmpty);
        const shouldHide = this.isVisible && !hasItems;

        if (this.autocompleteObservable && hasMinimumText) {
            return this.getItemsFromObservable(value);
        }

        if ((!this.showDropdownIfEmpty && !value) || maxItemsReached || isDisabled) {
            return this.dropdown.hide();
        }

        this.setItems(items);

        if (shouldShow) {
            this.dropdown.show(position);
        } else if (shouldHide) {
            this.hide();
        }
    }

    /**
     * @name hide
     */
    public hide(): void {
        this.resetItems();
        this.dropdown.hide();
    }

    /**
     * @name scrollListener
     */
    @HostListener('window:scroll')
    public scrollListener(): void {
        if (!this.isVisible || !this.dynamicUpdate) {
            return;
        }

        this.updatePosition();
    }

    /**
     * @name onWindowBlur
     */
    @HostListener('window:blur')
    public onWindowBlur(): void {
        this.dropdown.hide();
    }

    /**
     * @name getFormValue
     */
    private getFormValue(): string {
        return this.tagInput.formValue.trim();
    }

    /**
     * @name calculatePosition
     */
    private calculatePosition(): ClientRect {
        return this.tagInput.inputForm.getElementPosition();
    }

    /**
     * @name requestAdding
     * @param item {Ng2MenuItem}
     */
    private requestAdding = async (item: Ng2MenuItem) => {
        const tag = this.createTagModel(item);
        await this.tagInput.onAddingRequested(true, tag).catch(() => {});
    }

    /**
     * @name createTagModel
     * @param item
     */
    private createTagModel(item: Ng2MenuItem): TagModel {
        const display = typeof item.value === 'string' ? item.value : item.value[this.displayBy];
        const value = typeof item.value === 'string' ? item.value : item.value[this.identifyBy];

        return {
            ...item.value,
            [this.tagInput.displayBy]: display,
            [this.tagInput.identifyBy]: value
        };
    }

    /**
     *
     * @param value {string}
     */
    private getMatchingItems(value: string): TagModel[] {
        if (!value && !this.showDropdownIfEmpty) {
            return [];
        }

        const dupesAllowed = this.tagInput.allowDupes;

        return this.autocompleteItems.filter((item: TagModel) => {
            const hasValue = dupesAllowed ? false : this.tagInput.tags.some(tag => {
                const identifyBy = this.tagInput.identifyBy;
                const model = typeof tag.model === 'string' ? tag.model : tag.model[identifyBy];

                return model === item[this.identifyBy];
            });

            return this.matchingFn(value, item) && (hasValue === false);
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
    private resetItems = (): void => {
        this.items = [];
    }

    /**
     * @name populateItems
     * @param data
     */
    private populateItems(data: any): TagInputDropdown {
        this.autocompleteItems = data.map(item => {
            return typeof item === 'string' ? {
                [this.displayBy]: item,
                [this.identifyBy]: item
            } : item;
        });

        return this;
    }

    /**
     * @name getItemsFromObservable
     * @param text
     */
    private getItemsFromObservable = (text: string): void => {
        this.setLoadingState(true);

        const subscribeFn = (data: any[]) => {
            // hide loading animation
            this.setLoadingState(false)
                // add items
                .populateItems(data);

            this.setItems(this.getMatchingItems(text));

            if (this.items.length) {
                this.dropdown.show(this.calculatePosition());
            } else if (!this.showDropdownIfEmpty && this.isVisible) {
                this.dropdown.hide();
            } else if (!this.showDropdownIfEmpty) {
                this.dropdown.hide();
            }
        };

        this.autocompleteObservable(text)
            .pipe(first())
            .subscribe(subscribeFn, () => this.setLoadingState(false));
    }

    /**
     * @name setLoadingState
     * @param state
     */
    private setLoadingState(state: boolean): TagInputDropdown {
        this.tagInput.isLoading = state;

        return this;
    }
}
