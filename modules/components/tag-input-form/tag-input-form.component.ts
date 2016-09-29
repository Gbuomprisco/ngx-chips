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
    template: require('./tag-input-form.template.html')
})
export class TagInputForm {
    @Output() onSubmit: EventEmitter<any> = new EventEmitter();
    @Output() onBlur: EventEmitter<Event> = new EventEmitter();
    @Output() onFocus: EventEmitter<Event> = new EventEmitter();
    @Output() onKeyup: EventEmitter<Event> = new EventEmitter();
    @Output() onKeydown: EventEmitter<Event> = new EventEmitter();

    // inputs
    @Input() placeholder: string;
    @Input() validators: ValidatorFn[] = [];

    @ViewChild('input') public input;
    public form: FormGroup;

    constructor(private renderer: Renderer) {}

    ngOnInit() {
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
            .map(err => messages[ err ]);
    }

    /**
     * @name hasErrors
     * @returns {boolean}
     */
    public hasErrors(): boolean {
        return this.form.dirty && this.form.value.item && this.form.invalid;
    }

	/**
     * @name focus
     */
    public focus(): void {
        this.renderer.invokeElementMethod(this.input.nativeElement, 'focus');
    }

	/**
     * @name getElementPosition
     * @returns {ClientRect}
     */
    public getElementPosition(): ClientRect {
        return this.input.nativeElement.getBoundingClientRect();
    }

    private onKeyDown($event) {
        if (this.value.value.length > 0) {
            return;
        }

        return this.onKeydown.emit($event);
    }
}
