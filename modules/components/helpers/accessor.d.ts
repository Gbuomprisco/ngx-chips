import { ControlValueAccessor } from '@angular/forms';
export declare type TagModel = string | {
    [key: string]: any;
};
export declare function isObject(obj: any): boolean;
export declare class TagInputAccessor implements ControlValueAccessor {
    private _items;
    private _onTouchedCallback;
    private _onChangeCallback;
    displayBy: string;
    identifyBy: string;
    items: TagModel[];
    onTouched(items: any): void;
    writeValue(items: any[]): void;
    registerOnChange(fn: any): void;
    registerOnTouched(fn: any): void;
    getItemValue(item: TagModel): string;
    protected getItemsWithout(index: number): TagModel[];
}
