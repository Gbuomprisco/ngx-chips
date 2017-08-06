import {Component} from '@angular/core';

import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';

import 'rxjs/add/observable/of';
import 'rxjs/add/operator/filter';

@Component({
    selector: 'app',
    styleUrls: ['./home.scss'],
    templateUrl: './home.html'
})
export class Home {
    form: FormGroup;

    constructor(private http: Http) {
        this.form = new FormBuilder().group({
            chips: [['chip'], []]
        });
    }

    disabled = true;

    items = ['Javascript', 'Typescript'];

    inputText = 'text';

    itemsAsObjects = [{id: 0, name: 'Angular', readonly: true}, {id: 1, name: 'React'}];

    autocompleteItems = ['Item1', 'item2', 'item3'];

    autocompleteItemsAsObjects = [
        {value: 'Item1', id: 0, extra: 0},
        {value: 'item2', id: 1, extra: 1},
        'item3'
    ];

    dragAndDropExample = ['C#', 'Java'];

    dragAndDropObjects = [{display: 'Javascript', value: 'Javascript'}, {display: 'Typescript', value: 'Typescript'}];
    dragAndDropStrings = ['CoffeScript', 'Scala.js'];

    public requestAutocompleteItems = (text: string): Observable<Response> => {
        const url = `https://api.github.com/search/repositories?q=${text}`;
        return this.http
            .get(url)
            .map(data => data.json().items.map(item => item.full_name));
    };

    public requestAutocompleteItemsFake = (text: string): Observable<string[]> => {
        return Observable.of([
            'item1', 'item2', 'item3'
        ]);
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
        console.log('tag edited: current value is ' + item);
    }

    public onValidationError(item) {
        console.log('invalid tag ' + item);
    }

    public transform(value: string): Observable<object> {
        const item = {display: `@${value}`, value: `@${value}`};
        return Observable.of(item);
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

    private validateAsync(control: FormControl) {
        return new Promise(resolve => {
            const value = control.value;
            const result = isNaN(value) ? {
                isNan: true
            } : null;
  
            setTimeout(() => {
                resolve(result);
            }, 1);
        });
    }

    public asyncErrorMessages = {
        isNan: 'Please only add numbers'
    };

    public validators = [this.startsWithAt, this.endsWith$];

    public asyncValidators = [this.validateAsync];

    public errorMessages = {
        'startsWithAt@': 'Your items need to start with \'@\'',
        'endsWith$': 'Your items need to end with \'$\''
    };

    public onAdding(tag): Observable<any> {
        const confirm = window.confirm('Do you really want to add this tag?');
        return Observable
            .of(tag)
            .filter(() => confirm);
    }

    public onRemoving(tag): Observable<any> {
        const confirm = window.confirm('Do you really want to remove this tag?');
        return Observable
            .of(tag)
            .filter(() => confirm);
    }

    public asyncOnAdding(tag): Observable<any> {
        const confirm = window.confirm('Do you really want to add this tag?');
        return Observable
            .of(tag)
            .filter(() => confirm);
    }
}
