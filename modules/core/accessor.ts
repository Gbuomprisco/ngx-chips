import { defaults } from './../defaults';
import { ControlValueAccessor } from '@angular/forms';
import { Input } from '@angular/core';
import { OptionsProvider } from './providers';

export type TagModel = string | {[key: string]: any};

export function isObject(obj: any): boolean {
    return obj === Object(obj);
}

export class TagInputAccessor implements ControlValueAccessor {
    private _items: TagModel[] = [];
    private _onTouchedCallback: () => void;
    private _onChangeCallback: (items: TagModel[]) => void;

    /**
     * @name displayBy
     * @type {string}
     */
    @Input() public displayBy: string = OptionsProvider.defaults.tagInput.displayBy;

    /**
     * @name identifyBy
     * @type {string}
     */
    @Input() public identifyBy: string = OptionsProvider.defaults.tagInput.identifyBy;

    public get items(): TagModel[] {
        return this._items;
    };

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
     * @return {TagModel}
     */
    public getItemValue(item: TagModel): string {
        return isObject(item) ? item[this.identifyBy] : item;
    }

    /**
     * @name getItemDisplay
     * @param item
     * @return {TagModel}
     */
    public getItemDisplay(item: TagModel): string {
        return isObject(item) ? item[this.displayBy] : item;
    }

    /**
     * @name getItemsWithout
     * @param index
     * @return {TagModel[]}
     */
    protected getItemsWithout(index: number): TagModel[] {
        return this.items.filter((item, position) => position !== index);
    }
}
