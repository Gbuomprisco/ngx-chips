export function customSeparatorKeys($event) {
    if (this.separatorKeys.indexOf($event.keyCode) >= 0) {
        $event.preventDefault();
        this.addItem();
    }
}

export function backSpaceListener ($event) {
    const itemsLength: number = this.items.length,
        inputValue: string = this.form.find('item').value,
        isCorrectKey = $event.keyCode === 37 || $event.keyCode === 8;

    if (isCorrectKey && !inputValue && itemsLength) {
        this.selectItem(this.items[itemsLength - 1]);
        this.renderer.invokeElementMethod(this.tagElements[itemsLength - 1], 'focus', []);
    }
}

export function addListener(listenerType: string, action: () => any, condition = true) : void{
    // if the event provided does not exist, throw an error
    if (!this.listeners.hasOwnProperty(listenerType)) {
        throw new Error('The event entered may be wrong');
    }

    // if a condition is present and is false, exit early
    if (!condition) {
        return;
    }

    // fire listener
    this.listeners[listenerType].push(action);
}


function getMatchingItems(value) {
    const itemsMatching: string[] = [];
    const items = this.autocompleteItems;
    const lowercaseValue = value.toLowerCase();

    items.forEach(item => {
        const condition = item.toLowerCase().indexOf(lowercaseValue) === 0 &&
            this.items.indexOf(item) === -1;

        if (condition) {
            itemsMatching.push(item);
        }
    });

    return itemsMatching;
}

export function autoCompleteListener(ev): void {
    const vm = this;
    const value: string = vm.form.value.item;
    const position: ClientRect = vm.input.element.getBoundingClientRect();
    const key = ev.keyCode;

    // exit early if no value is entered
    if (!value) {
        this.itemsMatching = [];
        this.dropdown.hide();
        return;
    }

    const itemsMatching = getMatchingItems.call(vm, value);
    this.itemsMatching = itemsMatching;

    if (itemsMatching.length) {
        const focus = key === 40 ? true : false;
        vm.dropdown.show(position, focus);
    }

    if (!itemsMatching.length && vm.dropdown.menu.state.isVisible) {
        vm.dropdown.hide();
    }
}

export function onAutocompleteItemClicked(item): void {
    if (!item) {
        return;
    }

    // add item
    this.setInputValue(item.value);
    this.addItem(true);
    this.focus();

    // hide dropdown
    this.dropdown.hide();
}
