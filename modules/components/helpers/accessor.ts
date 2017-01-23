import {
  ControlValueAccessor
} from '@angular/forms';

import { Input } from '@angular/core';

export type TagModel = string | {[key: string]: any};

export function isObject(obj: any): boolean {
    return obj === Object(obj);
}

export class TagInputAccessor implements ControlValueAccessor {
    private _items: TagModel[] = [];
    private _onTouchedCallback: (items: TagModel[]) => void;
    private _onChangeCallback: (items: TagModel[]) => void;

    /**
     * @name displayBy
     * @type {string}
     */
    @Input() public displayBy: string = 'display';

    /**
     * @name identifyBy
     * @type {string}
     */
    @Input() public identifyBy: string = 'value';

    public get items(): TagModel[] {
        return this._items;
    };

    public set items(items: TagModel[]) {
        this._items = items;
        this._onChangeCallback(this._items);
    }

    onTouched(items) {
        this._onTouchedCallback(items);
    }

    writeValue(items: any[]) {
        this._items = items || [];
    }

    registerOnChange(fn: any) {
        this._onChangeCallback = fn;
    }

    registerOnTouched(fn: any) {
        this._onTouchedCallback = fn;
    }

    public getItemValue(item: TagModel): string {
        return isObject(item) ? item[this.identifyBy] : item;
    }

    protected getItemsWithout(index: number): TagModel[] {
        return this.items.filter((item, position) => position !== index);
    }
}
