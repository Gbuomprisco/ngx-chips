import { ControlValueAccessor } from '@angular/forms';
import { Input, Directive } from '@angular/core';
import { OptionsProvider } from './providers/options-provider';
import { TagInputDropdown } from '../components/dropdown/tag-input-dropdown.component';

export class TagModelClass {
    [key: string]: any;
}

export type TagModel = string | TagModelClass;

export function isObject(obj: any): boolean {
    return obj === Object(obj);
}

@Directive()
export class TagInputAccessor implements ControlValueAccessor {
    private _items: TagModel[] = [];
    private _onTouchedCallback: () => void;
    private _onChangeCallback: (items: TagModel[]) => void;

    public dropdown: TagInputDropdown;

    /**
     * @name displayBy
     */
    @Input() public displayBy: string = OptionsProvider.defaults.tagInput.displayBy;

    /**
     * @name identifyBy
     */
    @Input() public identifyBy: string = OptionsProvider.defaults.tagInput.identifyBy;

    public get items(): TagModel[] {
        return this._items;
    }

    public set items(items: TagModel[]) {
        this._items = items;
        this._onChangeCallback(this._items);
    }

    public onTouched() {
        this._onTouchedCallback();
    }

    public writeValue(items: any[]) {
        this._items = items || [];
    }

    public registerOnChange(fn: any) {
        this._onChangeCallback = fn;
    }

    public registerOnTouched(fn: any) {
        this._onTouchedCallback = fn;
    }

    /**
     * @name getItemValue
     * @param item
     * @param fromDropdown
     */
    public getItemValue(item: TagModel, fromDropdown = false): string {
        const property = fromDropdown && this.dropdown ? this.dropdown.identifyBy : this.identifyBy;
        return isObject(item) ? item[property] : item;
    }

    /**
     * @name getItemDisplay
     * @param item
     * @param fromDropdown
     */
    public getItemDisplay(item: TagModel, fromDropdown = false): string {
        const property = fromDropdown && this.dropdown ? this.dropdown.displayBy : this.displayBy;
        return isObject(item) ? item[property] : item;
    }

    /**
     * @name getItemsWithout
     * @param index
     */
    protected getItemsWithout(index: number): TagModel[] {
        return this.items.filter((item, position) => position !== index);
    }
}
