import {Component} from '@angular/core';

import { FormControl } from '@angular/forms';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs';

@Component({
    selector: 'app',
    styleUrls: ['./home.scss'],
    templateUrl: './home.html'
})
export class Home {
    constructor(private http: Http) {}

    items = ['Javascript', 'Typescript'];

    inputText = 'text';

    itemsAsObjects = [{id: 0, name: 'Angular', extra: 0}, {id: 1, name: 'React', extra: 1}];

    autocompleteItems = ['Item1', 'item2', 'item3'];

    autocompleteItemsAsObjects = [
        {value: 'Item1', id: 0, extra: 0},
        {value: 'item2', id: 1, extra: 1},
        'item3'
    ];

    public requestAutocompleteItems = (text: string): Observable<Response> => {
        const url = `https://api.github.com/search/repositories?q=${text}`;
        return this.http
            .get(url)
            .map(data => data.json().items.map(item => item.full_name));
    };

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

    public onTagEdited(item) {
        console.log('input blurred: current value is ' + item);
    }

    public onValidationError(item) {
        console.log('invalid tag ' + item);
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
