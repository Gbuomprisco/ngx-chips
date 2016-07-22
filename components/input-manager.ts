import { FOCUS } from './constants';

export const input = {
    element: <HTMLElement>undefined,
    isFocused: <boolean>false,

    // methods
    isVisible: isVisible,
    focus: focus,
    blur: blur
};


/**
 * @name isVisible
 * @returns {boolean}
 */
function isVisible(): boolean {
    const maxItemsReached = this.maxItems !== undefined && this.items.length === this.maxItems;
    return !this.readonly && !maxItemsReached;
}


/**
 * @name focus
 * @desc focuses input element
 */
function focus(): void {
    const vm = this;

    // exit early if the input is not visible
    if (!vm.input.isVisible()) {
        return;
    }

    // set input as focused and unselect tag
    vm.renderer.invokeElementMethod(vm.input.element, FOCUS, []);
    vm.input.isFocused = true;
    vm.select(undefined);
}


/**
 * @name blur
 */
function blur() {
    this.input.isFocused = false;
}
