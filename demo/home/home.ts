import {Component} from '@angular/core';
import {TagInput} from '../../components/tag-input/tag-input.component';

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

    public toUpperCase(item: string): string {
        if (item === 'Typescript') {
            return item.toUpperCase();
        }

        return undefined;
    }
    
    ngOnInit() {

    }
}