# ng2 Tag Input
Tag Input component for Angular 2. Blandly inspired by Angular Material's md-chips.

[![Build Status](https://travis-ci.org/Gbuomprisco/ng2-tag-input.svg?branch=develop)](https://travis-ci.org/Gbuomprisco/ng2-tag-input) [![codecov](https://codecov.io/gh/Gbuomprisco/ng2-tag-input/branch/develop/graph/badge.svg)](https://codecov.io/gh/Gbuomprisco/ng2-tag-input)

### [DEMO](https://gbuomprisco.github.io/ng2-tag-input/)

## Install the component

    npm install ng2-tag-input --save
    
## Run the tests

    npm test

## Usage

Once installed, import the TagInput component and use it in your container component:

    import TagInput from 'ng2-tag-input';
    import {Component} from '@angular2/core';

    @Component({
        selector: 'app',
        directives: [TagInput],
        template: `<tag-input [(ngModel)]='items'></tag-input>`
    });
    export class App {
        items = ['Pizza', 'Pasta', 'Parmesan'];
        // ...
    }

## API

@Input:
- `placeholder` - (`?string`) - String that sets the placeholder of the input for entering new terms.
- `secondaryPlaceholder` - (`?string`) - String that sets the placeholder of the input for entering new terms when there are 0 items entered.
- `maxItems` -  (`?number`) - Sets the maximum number of items it is possible to enter.
- `readonly` - (`?boolean`) - Sets the tag input static, not allowing deletion/addition of the items entered.
- `separatorKeys` - (`?string[]`) - Array of keyboard keys with which is possible to define the key for separating terms. By default. only Enter is the defined key.
- `transform` - (`?(item: string) => string`) - a function that takes as argument the value of an item, and returns a string with the new value when appended. If the method returns null/undefined/false, the item gets rejected.
- `validators` - (`?Validators[]`) - an array of Validators (custom or Angular's) that will validate the tag before adding it to the list of items. It is possible to use multiple validators.

@Output:
- `onAdd` - (`onAdd(item: string)`) - event fired when an item has been added
- `onRemove` - (`onRemove(item: string)`) - event fired when an item has been removed
- `onSelect` - (`onSelect(item: string)`) - event fired when an item has been selected

Examples:

    // example app

    @Component({
        selector: 'app',
        directives: [TagInput],
        template: `<tag-input [(ngModel)]='items'></tag-input>`
    });
    export class App {
        items = ['Pizza', 'Pasta', 'Parmesan'];
        options = {
            placeholder: "+ term",
            secondaryPlaceholder: "Enter a new term",
            separatorKeys: [4, 5]
            maxItems: 10
        }
        onItemAdded(item) {
            console.log(``${item} has been added`)
        }
        onItemRemoved(item) {
            console.log(``${item} has been removed :(`)
        }
        // ...
    }

    <tag-input [(ngModel)]='items'
               [placeholder]="options.placeholder"
               [secondaryPlaceholder]="options.secondaryPlaceholder"
               [maxItems]="options.maxItems"
               [separatorKeys]="options.separatorKeys">
    </tag-input>

    <tag-input [(ngModel)]='items'
               (onRemove)="onItemRemoved($event)"
               (onAdd)="onItemAdded($event)">
    </tag-input>

