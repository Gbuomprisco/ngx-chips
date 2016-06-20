# ng2 Tag Input
Tag Input component for Angular 2. Blandly inspired by Angular Material's md-chips.

[![Build Status](https://travis-ci.org/Gbuomprisco/ng2-tag-input.svg?branch=develop)](https://travis-ci.org/Gbuomprisco/ng2-tag-input)

## Install

    npm install https://github.com/Gbuomprisco/ng2-tag-input

## Use

Once installed, import the TagInput component and use it in your container component:

    import {TagInput} from 'ng2-tag-input';
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

Properties:
- placeholder (string): The placeholder of the input for entering new terms.
- secondaryPlaceholder (string): The placeholder of the input for entering new terms when there are 0 items entered.
- maxItems (number): the maximum number of items it is possible to enter.
- readonly (boolean): sets the tag input static, not allowing deletion/addition of the items entered.
- separatorKeys (string[]): array of keyboard keys with which is possible to define the key for separating terms. By default. only Enter is the defined key.

Events:
- onAdd(item: string): event fired when an item has been added
- onRemove(item: string): event fired when an item has been removed

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

