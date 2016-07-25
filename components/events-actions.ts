import { Ng2MenuItemComponent } from 'ng2-material-dropdown';

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

    this.autocompleteItems.forEach(item => {
        if (item.match(value) && this.items.indexOf(item) === -1) {
            itemsMatching.push(item);
        }
    });

    return itemsMatching;
}

export function autoCompleteListener(ev): void {
    const vm = this;
    const value: string = vm.form.value.item;
    const position: ClientRect = vm.input.element.getBoundingClientRect();


    // exit early if no value is entered
    if (!value) {
        return;
    }

    const itemsMatching = getMatchingItems.call(vm, value);
    this.itemsMatching = itemsMatching;

    if (itemsMatching.length) {
        const focus = ev.keyCode === 40 ? true : false;
        if (focus) {
            vm.dropdown.state.select(vm.dropdown.menu.items.first);
        }
        vm.dropdown.show(position, focus);
    }

    if (!itemsMatching.length && vm.dropdown.menu.state.isVisible) {
        vm.dropdown.hide();
    }
}

export function onAutocompleteItemClicked(item: Ng2MenuItemComponent): void {
    this.setInputValue(item.value);
    this.addItem(true);
    this.focus();
    this.dropdown.hide();
}
