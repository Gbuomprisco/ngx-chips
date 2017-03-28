import {
    Component,
    Input,
    Output,
    EventEmitter,
    Renderer,
    ViewChild
} from '@angular/core';

import {
    FormGroup,
    FormControl,
    Validators,
    ValidatorFn,
    AbstractControl
} from '@angular/forms';

@Component({
    selector: 'tag-input-form',
    styleUrls: [ './tag-input-form.style.scss' ],
    templateUrl: './tag-input-form.template.html'
})
export class TagInputForm {
    /**
     * @name onSubmit
     * @type {EventEmitter}
     */
    @Output() public onSubmit: EventEmitter<any> = new EventEmitter();

    /**
     * @name onBlur
     * @type {EventEmitter}
     */
    @Output() public onBlur: EventEmitter<any> = new EventEmitter();

    /**
     * @name onFocus
     * @type {EventEmitter}
     */
    @Output() public onFocus: EventEmitter<any> = new EventEmitter();

    /**
     * @name onKeyup
     * @type {EventEmitter}
     */
    @Output() public onKeyup: EventEmitter<any> = new EventEmitter();

    /**
     * @name onKeydown
     * @type {EventEmitter}
     */
    @Output() public onKeydown: EventEmitter<any> = new EventEmitter();

    // inputs

    /**
     * @name placeholder
     * @type {string}
     */
    @Input() public placeholder: string;

    /**
     * @name validators
     * @type {ValidatorFn[]}
     */
    @Input() public validators: ValidatorFn[] = [];

    /**
     * @name inputId
     * @type {string}
     */
    @Input() public inputId: string;

    /**
     * @name inputClass
     * @type {string}
     */
    @Input() public inputClass: string;

    /**
     * @name inputText
     */
    @Input() public get inputText(): string {
        return this.inputTextValue;
    }

    /**
     * @name tabindex
     * @desc pass through the specified tabindex to the input
     * @type {string}
     */
    @Input() public tabindex: string = undefined;

    /**
     * @name inputText
     * @param text {string}
     */
    public set inputText(text: string) {
        this.inputTextValue = text;
        this.inputTextChange.emit(text);
    }

    /**
     * @name input
     */
    @ViewChild('input') public input;

    /**
     * @name form
     */
    public form: FormGroup;

    /**
     * @name inputTextChange
     * @type {EventEmitter}
     */
    @Output() public inputTextChange: EventEmitter<string> = new EventEmitter();

    /**
     * @name inputTextValue
     */
    public inputTextValue = '';

    constructor(private renderer: Renderer) {}

    public ngOnInit() {
        // creating form
        this.form = new FormGroup({
            item: new FormControl('', Validators.compose(this.validators))
        });
    }

	/**
     * @name value
     * @returns {AbstractControl}
     */
    public get value(): AbstractControl {
        return this.form.get('item');
    }

	/**
     * @name isInputFocused
     * @returns {boolean}
     */
    public isInputFocused(): boolean {
        return document.activeElement === this.input.nativeElement;
    }

	/**
     * @name getErrorMessages
     * @param messages
     * @returns {string[]}
     */
    public getErrorMessages(messages): string[] {
        return Object.keys(messages)
            .filter(err => this.value.hasError(err))
            .map(err => messages[err]);
    }

    /**
     * @name hasErrors
     * @returns {boolean}
     */
    public hasErrors(): boolean {
        return this.form.dirty &&
            this.form.value.item &&
            this.form.invalid;
    }

	/**
     * @name focus
     */
    public focus(): void {
        this.renderer.invokeElementMethod(this.input.nativeElement, 'focus');
    }

    /**
     * @name blur
     */
    public blur(): void {
        this.renderer.invokeElementMethod(this.input.nativeElement, 'blur');
    }

	/**
     * @name getElementPosition
     * @returns {ClientRect}
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
        this.renderer.invokeElementMethod(input.parentElement, 'removeChild', [input]);
    }

    /**
     * @name onKeyDown
     * @param $event
     */
    public onKeyDown($event) {
        return this.onKeydown.emit($event);
    }

    /**
     * @name submit
     */
    public submit($event: any): void {
        this.onSubmit.emit($event);
    }
}
