import {
    Component,
    ViewChild,
    forwardRef,
    Inject,
    TemplateRef,
    ContentChildren,
    Input,
    QueryList,
    HostListener,
    EventEmitter,
    Type
} from '@angular/core';

// rx
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/first';

import { Ng2Dropdown, Ng2MenuItem } from 'ng2-material-dropdown';
import { TagModel, TagInputDropdownOptions, OptionsProvider } from '../../core';
import { TagInputComponent } from '../../components';

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
     * @type {TemplateRef}
     */
    @ContentChildren(TemplateRef) public templates: QueryList<TemplateRef<any>>;

    /**
     * @name offset
     * @type {string}
     */
    @Input() public offset: string = new defaults().offset;

    /**
     * @name focusFirstElement
     * @type {boolean}
     */
    @Input() public focusFirstElement = new defaults().focusFirstElement;

    /**
     * - show autocomplete dropdown if the value of input is empty
     * @name showDropdownIfEmpty
     * @type {boolean}
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
     * @type {boolean}
     */
    @Input() public appendToBody = new defaults().appendToBody;

    /**
     * @name keepOpen
     * @description option to leave dropdown open when adding a new item
     * @type {boolean}
     */
    @Input() public keepOpen = new defaults().keepOpen;

    /**
     * list of items that match the current value of the input (for autocomplete)
     * @name items
     * @type {TagModel[]}
     */
    public items: TagModel[] = [];

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
        const items = this._autocompleteItems;

        return items ? items.map((item: TagModel) => {
            return typeof item === 'string' ? {
                [this.displayBy]: item,
                [this.identifyBy]: item
            } : item;
        }) : [];
    }

    constructor(@Inject(forwardRef(() => TagInputComponent)) public tagInput: TagInputComponent) {}

    /**
     * @name ngOnInit
     */
    public ngOnInit(): void {
        this.onItemClicked()
            .subscribe(this.requestAdding);

        this.onHide()
            .subscribe(() => this.setItems([]));

        this.setupTextChangeSubscription();
    }

    /**
     * @name updatePosition
     */
    public updatePosition(): void {
        const position = this.tagInput.form.getElementPosition();

        this.dropdown.menu.updatePosition(position);
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
     * @description method called when something changed (ex. form text, click on input, etc.)
     * @name onChange
     */
    public onChange = (): void => {
        if (this.autocompleteObservable) {
            return this.getItemsFromObservable();
        }

        if (!this.showDropdownIfEmpty && !this.getFormValue()) {
            return this.hide();
        }

        this.toggle();
    }

    /**
     * @name show
     */
    public show(): void {
        this.dropdown.show(this.calculatePosition());
    }

    /**
     * @name hide
     */
    public hide(): void {
        this.setItems([]);
        this.dropdown.hide();
    }

    /**
     * @name scrollListener
     */
    @HostListener('window:scroll')
    public scrollListener(): void {
        if (!this.isVisible) {
            return;
        }

        this.updatePosition();
    }

    /**
     * @name onWindowBlur
     */
    @HostListener('window:blur')
    public onWindowBlur(): void {
        this.hide();
    }

    /**
     * @name toggle
     */
    private toggle(): void {
        const value = this.getFormValue();
        const items = this.getMatchingItems(value);
        const shouldHide = this.isVisible && items.length === 0;

        this.setItems(items);

        if (this.shouldDropdownShow(value)) {
            this.show();
        } else if (shouldHide) {
            this.hide();
        }
    }

    /**
     * @name shouldDropdownShow
     * @param value
     */
    private shouldDropdownShow(value = this.getFormValue()): boolean {
        const hasItems = this.items.length > 0;
        const isHidden = this.isVisible === false;
        const showDropdownIfEmpty = this.showDropdownIfEmpty && hasItems && !value;
        const hasMinimumText = value.trim().length >= this.minimumTextLength;

        return isHidden && ((hasItems && hasMinimumText) || showDropdownIfEmpty);
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
        return this.tagInput.form.getElementPosition();
    }

    /**
     * @name requestAdding
     * @param item {Ng2MenuItem}
     */
    private requestAdding = (item: Ng2MenuItem): void => {
        this.tagInput.onAddingRequested(true, this.createTagModel(item));
    }

    /**
     * @name createTagModel
     * @param item
     * @return {TagModel}
     */
    private createTagModel(item: Ng2MenuItem): TagModel {
        const isString = typeof item.value === 'string';
        const display = isString ? item.value : item.value[this.displayBy];
        const value = isString ? item.value : item.value[this.identifyBy];

        return {
            ...item.value,
            [this.tagInput.displayBy]: display,
            [this.tagInput.identifyBy]: value
        };
    }

    /**
     *
     * @param value {string}
     * @returns {any}
     */
    private getMatchingItems(value: string): TagModel[] {
        if (!value && !this.showDropdownIfEmpty) {
            return [];
        }

        const exists = (item: TagModel): boolean => this.tagInput.allowDupes ? false : 
            this.tagInput.tags.some(tag => {
                const identifyBy = this.tagInput.identifyBy;
                const model = typeof tag.model === 'string' ? tag.model : tag.model[identifyBy];

                return model === item[this.identifyBy];
            });

        return this.autocompleteItems.filter((item: TagModel) => {
            return this.matchingFn(value, item) && exists(item) === false;
        });
    }

    /**
     * @name setItems
     */
    private setItems(items: TagModel[]): void {
        this.items = items.slice(0, this.limitItemsTo || items.length);
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
     */
    private getItemsFromObservable = (): void => {
        const text = this.getFormValue();

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
            }
        };

        this.autocompleteObservable(text)
            .first()
            .subscribe(
                subscribeFn, 
                () => this.setLoadingState(false)
            );
    }

    /**
     * @name setupTextChangeSubscription
     */
    private setupTextChangeSubscription(): void {
        const DEBOUNCE_TIME = 200;

        const filterFn = (value: string): boolean => {
            if (this.keepOpen === false) {
                return value.length > 0;
            }

            return true;
        };

        this.tagInput
            .onTextChange
            .debounceTime(DEBOUNCE_TIME)
            .filter(filterFn)
            .subscribe(this.onChange);
    }

    /**
     * @name setLoadingState
     * @param state
     * @return {TagInputDropdown}
     */
    private setLoadingState(state: boolean): TagInputDropdown {
        this.tagInput.isLoading = state;

        return this;
    }
}
