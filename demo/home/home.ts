import {Component} from '@angular/core';
import {TagInput} from '../../modules/ng2-tag-input.module';

import {
    FormControl
} from '@angular/forms';

import { NgModule } from '@angular/core';

@Component({
    selector: 'app',
    template: require('./home.html')
})
export class Home {
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


@NgModule({
    imports: [TagInput],
    declarations: [Home],
    exports: [Home]
})
export class HomeModule {}
