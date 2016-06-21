import {Component} from '@angular/core';
import {TagInput} from '../../components/tag-input/tag-input.component';

import {
    Validators,
    Control
} from '@angular/common';

@Component({
    selector: 'app',
    directives: [TagInput],
    template: require('./home.html')
})

export class App {
    public items = ['Javascript', 'Typescript'];
    constructor() {}

    public options = {
        readonly: undefined,
        placeholder: '+ Tag'
    };

    public onAdd(item) {
        console.log(item + ' added');
    }

    public onRemove(item) {
        console.log(item + ' removed');
    }

    public onSelect(item) {
        console.log(item + ' selected');
    }

    public transform(item: string): string {
        return `@${item}`;
    }

    private startsWithAt(control: Control) {
        if (control.value.charAt(0) !== '@') {
            return {
                'startsWithAt@': true
            };
        }

        return null;
    }

    public validators = [Validators.minLength(3), this.startsWithAt];

    ngOnInit() {

    }
}