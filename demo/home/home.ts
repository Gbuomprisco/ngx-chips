import {Component} from '@angular/core';
import {TagInput} from '../../components/tag-input';

import {
    FormControl
} from '@angular/forms';

@Component({
    selector: 'app',
    directives: [TagInput],
    template: require('./home.html')
})

export class App {
    constructor() {}

    items = ['Javascript', 'Typescript'];

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

    private startsWithAt(control: FormControl) {
        if (control.value.charAt(0) !== '@') {
            return {
                'startsWithAt@': true
            };
        }

        return null;
    }

    public validators = [this.startsWithAt];

    ngOnInit() {

    }
}
