import {ControlValueAccessor} from '@angular/common';

export class TagInputAccessor implements ControlValueAccessor {
    private _value: string[] = [];

    private _onTouchedCallback: (items: string[]) => void;

    private _onChangeCallback: (items: string[]) => void;

    public get value(): string[] {
        return this._value;
    };

    public set value(items: string[]) {
        this._value = items;
        this._onChangeCallback(items);
    }

    onTouched(items) {
        this._onTouchedCallback(items);
    }

    writeValue(items: string[]) {
        this._value = items;
    }

    registerOnChange(fn: any) {
        this._onChangeCallback = fn;
    }

    registerOnTouched(fn: any) {
        this._onTouchedCallback = fn;
    }
}