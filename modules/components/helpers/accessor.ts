import {
  ControlValueAccessor
} from '@angular/forms';

import { Input } from '@angular/core';

export class TagModel {
    constructor(public display: string, public value: string) {
        this.display = display;
        this.value = value;
    }
}

function isObject(obj: any): boolean {
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
    @Input() private displayBy: string = 'display';

    /**
     * @name identifyBy
     * @type {string}
     */
    @Input() private identifyBy: string = 'value';

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
        this._items = this.transformItems(items);
    }

    registerOnChange(fn: any) {
        this._onChangeCallback = fn;
    }

    registerOnTouched(fn: any) {
        this._onTouchedCallback = fn;
    }

    /**
     * @name transformItems
     * @param items
     * @returns {TagModel|TagModel[]|Array}
     */
    private transformItems(items: any[]): TagModel[] {
        const displayBy = this.displayBy;
        const identifyBy = this.identifyBy;

        return items ? items.map(item => {
            if (isObject(item)) {

                // throw an error if the items do not have the properties needed
                if (!item.hasOwnProperty(displayBy) || !item.hasOwnProperty(identifyBy)) {
                    throw new Error(`
                        'Please, make sure the objects have "identifyBy" and "displayBy" properties,
                         by default these are "value" and "display", but you can pass your own as inputs
                    `);
                }

                return new TagModel(item[this.displayBy], item[this.identifyBy]);
            }

            // if the user returned an array of strings, give the same value to display and value
            return new TagModel(item, item);
        }) : [];
    }
}
