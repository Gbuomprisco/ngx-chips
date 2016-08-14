import { TagInput } from './tag-input';

import {
    Component
} from '@angular/core';

import {
    Validators,
    FormControl
} from '@angular/forms';


function getItems() {
    return ['Javascript', 'Typescript'];
}

const validators = [Validators.minLength(3), (control: FormControl) => {
    if (control.value.charAt(0) !== '@') {
        return {
            'startsWithAt@': true
        };
    }
    return null;
}];

@Component({
    selector: 'test-app',
    template: `<tag-input [(ngModel)]="items"></tag-input>`,
    directives: [ TagInput ]
})
export class BasicTagInput {
    public items = getItems();
}

@Component({
    selector: 'test-app',
    template: `<tag-input
                  [(ngModel)]="items"
                  (onRemove)="onRemove($event)"
                  (onAdd)="onAdd($event)">
              </tag-input>`,
    directives: [ TagInput ]
})
export class TagInputWithOutputs {
    public items = getItems();

    onAdd(item) {}
    onRemove(item) {}

    public validators: any = validators;
}

@Component({
    selector: 'test-app',
    template: `<tag-input
                  [(ngModel)]="items"
                  [validators]="validators"
                  (onRemove)="onRemove($event)"
                  (onAdd)="onAdd($event)">
              </tag-input>`,
    directives: [ TagInput ]
})
export class TagInputWithValidation {
    public items = getItems();
    validators: any = validators;
    onAdd(item) {}
    onRemove(item) {}
}

@Component({
    selector: 'test-app',
    template: `<tag-input [(ngModel)]="items" 
                          [validators]="validators"
                          [transform]="addPrefix">
                         </tag-input>`,
    directives: [ TagInput ]
})
export class TagInputWithTransformer {
    public items = getItems();

    addPrefix(item: string) {
        return `prefix: ${item}`;
    }
    validators: any = validators.splice(0, 1);
}

@Component({
    selector: 'test-app',
    template: `<tag-input [(ngModel)]="items" [placeholder]="'New Tag'"></tag-input>`,
    directives: [ TagInput ]
})
export class TagInputWithPlaceholder {
    public items = getItems();
}

@Component({
    selector: 'test-app',
    template: `<tag-input [(ngModel)]="items" [maxItems]="2"></tag-input>`,
    directives: [ TagInput ]
})
export class TagInputWithMaxItems {
    public items = getItems();
}

export const COMPONENTS = [
    BasicTagInput,
    TagInputWithPlaceholder,
    TagInputWithOutputs,
    TagInputWithTransformer,
    TagInputWithValidation,
    TagInputWithMaxItems
];
