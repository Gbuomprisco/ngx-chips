import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { AsyncValidatorFn, FormControl, FormGroup, ValidatorFn } from '@angular/forms';
import { KeyDownEvent } from '../../core/helpers/keydown-event';

@Component({
    selector: 'tag-input-form',
    styleUrls: ['./tag-input-form.style.scss'],
    templateUrl: './tag-input-form.template.html'
})
export class TagInputForm implements OnInit, OnChanges {
    /**
     * @name onSubmit
     */
    @Output() public onSubmit: EventEmitter<Event> = new EventEmitter();

    /**
     * @name onBlur
     */
    @Output() public onBlur: EventEmitter<FocusEvent> = new EventEmitter();

    /**
     * @name onFocus
     */
    @Output() public onFocus: EventEmitter<FocusEvent> = new EventEmitter();

    /**
     * @name onKeyup
     */
    @Output() public onKeyup: EventEmitter<KeyboardEvent> = new EventEmitter();

    /**
     * @name onKeydown
     */
    @Output() public onKeydown: EventEmitter<KeyboardEvent> = new EventEmitter();

    /**
     * @name inputTextChange
     */
    @Output() public inputTextChange: EventEmitter<string> = new EventEmitter();

    // inputs

    /**
     * @name placeholder
     */
    @Input() public placeholder: string;

    /**
     * @name validators
     */
    @Input() public validators: ValidatorFn[] = [];

    /**
     * @name asyncValidators
     * @desc array of AsyncValidator that are used to validate the tag before it gets appended to the list
     */
    @Input() public asyncValidators: AsyncValidatorFn[] = [];

    /**
     * @name inputId
     */
    @Input() public inputId: string;

    /**
     * @name inputClass
     */
    @Input() public inputClass: string;

    /**
     * @name tabindex
     * @desc pass through the specified tabindex to the input
     */
    @Input() public tabindex = '';

    /**
     * @name disabled
     */
    @Input() public disabled = false;

    /**
     * @name input
     */
    @ViewChild('input', { static: false }) public input;

    /**
     * @name form
     */
    public form: FormGroup;

    /**
     * @name inputText
     */
    @Input()
    public get inputText(): string {
        return this.item.value;
    }

    /**
     * @name inputText
     * @param text {string}
     */
    public set inputText(text: string) {
        this.item.setValue(text);

        this.inputTextChange.emit(text);
    }

    protected readonly item: FormControl = new FormControl({ value: '', disabled: this.disabled });

    public ngOnInit(): void {
        this.item.setValidators(this.validators);
        this.item.setAsyncValidators(this.asyncValidators);

        // creating form
        this.form = new FormGroup({
            item: this.item
        });
    }

    public ngOnChanges(changes: SimpleChanges): void {
        if (changes.disabled && !changes.disabled.firstChange) {
            if (changes.disabled.currentValue) {
                this.form.controls['item'].disable();
            } else {
                this.form.controls['item'].enable();
            }
        }
    }

    /**
     * @name value
     */
    public get value(): FormControl {
        return this.form.get('item') as FormControl;
    }

    /**
     * @name isInputFocused
     */
    public isInputFocused(): boolean {
        const doc = typeof document !== 'undefined' ? document : undefined;
        return doc ? doc.activeElement === this.input.nativeElement : false;
    }

    /**
     * @name getErrorMessages
     * @param messages
     */
    public getErrorMessages(messages: { [key: string]: string }): string[] {
        return Object.keys(messages)
            .filter(err => this.value.hasError(err))
            .map(err => messages[err]);
    }

    /**
     * @name hasErrors
     */
    public hasErrors(): boolean {
        const { dirty, value, valid } = this.form;
        return dirty && value.item && !valid;
    }

    /**
     * @name focus
     */
    public focus(): void {
        this.input.nativeElement.focus();
    }

    /**
     * @name blur
     */
    public blur(): void {
        this.input.nativeElement.blur();
    }

    /**
     * @name getElementPosition
     */
    public getElementPosition(): ClientRect {
        return this.input.nativeElement.getBoundingClientRect();
    }

    /**
     * - removes input from the component
     * @name destroy
     */
    public destroy(): void {
        const input = this.input.nativeElement;
        input.parentElement.removeChild(input);
    }

    /**
     * @name onKeyDown
     * @param $event
     */
    public onKeyDown($event: KeyboardEvent) {
        this.inputText = this.value.value;
        if ($event.key === 'Enter') {
            this.submit($event);
        } else {
          return this.onKeydown.emit($event);
        }
    }

    /**
     * @name onKeyUp
     * @param $event
     */
    public onKeyUp($event: KeyboardEvent) {
        this.inputText = this.value.value;
        return this.onKeyup.emit($event);
    }

    /**
     * @name submit
     */
    public submit($event: Event): void {
        $event.preventDefault();
        this.onSubmit.emit($event);
    }
}
