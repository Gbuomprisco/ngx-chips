import {Component} from '@angular/core';

import {
    FormControl
} from '@angular/forms';

@Component({
    selector: 'app',
    templateUrl: './home.html'
})
export class Home {
    items = ['Javascript', 'Typescript'];

    public options = {
        readonly: undefined,
        placeholder: '+ Tag'
    };

    public onAdd(item) {
        console.log('tag added: value is ' + item);
    }

    public onRemove(item) {
        console.log('tag removed: value is ' + item);
    }

    public onSelect(item) {
        console.log('tag selected: value is ' + item);
    }

    public onFocus(item) {
        console.log('input focused: current value is ' + item);
    }

    public onTextChange(text) {
        console.log('text changed: value is ' + text);
    }

    public onBlur(item) {
        console.log('input blurred: current value is ' + item);
    }

    public transform(item: string): string {
        return `@${item}`;
    }

    private startsWithAt(control: FormControl) {
        if (control.value.charAt(0) !== '@') {
            return {
                'startsWithAt@': true
            };
        }

        return null;
    }

    private endsWith$(control: FormControl) {
        if (control.value.charAt(control.value.length - 1) !== '$') {
            return {
                'endsWith$': true
            };
        }

        return null;
    }

    public validators = [this.startsWithAt, this.endsWith$];

    public errorMessages = {
        'startsWithAt@': 'Your items need to start with \'@\'',
        'endsWith$': 'Your items need to end with \'$\''
    };
}
