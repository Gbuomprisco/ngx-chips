import { EventEmitter, Renderer } from '@angular/core';
import { FormGroup, ValidatorFn, AbstractControl } from '@angular/forms';
export declare class TagInputForm {
    private renderer;
    onSubmit: EventEmitter<any>;
    onBlur: EventEmitter<any>;
    onFocus: EventEmitter<any>;
    onKeyup: EventEmitter<any>;
    onKeydown: EventEmitter<any>;
    placeholder: string;
    validators: ValidatorFn[];
    inputId: string;
    inputClass: string;
    input: any;
    form: FormGroup;
    constructor(renderer: Renderer);
    ngOnInit(): void;
    readonly value: AbstractControl;
    isInputFocused(): boolean;
    getErrorMessages(messages: any): string[];
    hasErrors(): boolean;
    focus(): void;
    blur(): void;
    getElementPosition(): ClientRect;
    destroy(): void;
    onKeyDown($event: any): void;
}
