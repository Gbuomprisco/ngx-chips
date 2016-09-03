
/**
 * @name focus
 * @desc focuses input element
 */
const focus = function(): void {

    // exit early if the input is not visible
    if (this.input.isFocused) {
        return;
    }

    // set input as focused and unselect tag
    this.renderer.invokeElementMethod(this.input.element, 'focus', []);
    this.input.isFocused = true;
    this.selectItem(undefined);
    
    this.onFocus.emit(this.form.value.item);
};


/**
 * @name blur
 */
const blur = function(): void {
    this.input.isFocused = false;

    if (this.autocomplete) {
        setTimeout(() => this.dropdown.hide(), 150);
    }

    this.onBlur.emit(this.form.value.item);
};

export const input = {
    element: <HTMLElement>undefined,
    isFocused: <boolean>false,

    // methods
    focus: focus,
    blur: blur
};
