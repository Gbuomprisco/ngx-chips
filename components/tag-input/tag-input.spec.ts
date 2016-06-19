import {
    describe,
    inject,
    it,
    fakeAsync,
    tick
} from '@angular/core/testing';

import { Component } from '@angular/core';
import {By} from '@angular/platform-browser';

// Load the implementations that should be tested
import {TagInput} from './tag-input.component';
import {Tag} from '../tag/tag.component';
import {TestComponentBuilder} from '@angular/compiler/testing';

describe('TagInput', () => {
    let builder: TestComponentBuilder;

    beforeEach(inject([TestComponentBuilder], (tcb: TestComponentBuilder): void => {
        builder = tcb;
    }));

    it('should have 2 tags set by ngModel',  (done: () => void) => {
        builder.createAsync(TestApp).then(fixture => {
            fixture.detectChanges();
            let tags = fixture.debugElement.queryAll(By.directive(Tag));
            expect(tags.length).toEqual(2);
            done();
        });
    });

    it('should override the default placeholder of the input',  (done: () => void) => {
        const template = `<tag-input [(ngModel)]="items" placeholder="New Tag"></tag-input>`;
        builder.overrideTemplate(TestApp, template).createAsync(TestApp).then(fixture => {
            fixture.detectChanges();
            let input = fixture.debugElement.query(By.css('input[type="text"]')).nativeElement;
            expect(input.getAttribute('placeholder')).toEqual('New Tag');
            done();
        });
    });

    describe("when a new item is added", function() {
        it('should be added to the list of items and update its parent\'s model', () => {
            const template = `<tag-input [(ngModel)]="items"></tag-input>`;
            builder.overrideTemplate(TestApp, template).createAsync(TestApp).then(fixture => {
                fixture.detectChanges();
                const component = fixture.debugElement.query(By.directive(TagInput)).componentInstance;
                component.model.value = "New Item";
                component.add();

                expect(component.model.value).toEqual('');

                fixture.detectChanges();

                expect(fixture.componentInstance.items.length).toEqual(3);
                expect(component.value.length).toEqual(3);
            });
        });

        it('should not be allowed if max-items is set up', () => {
            const template = `<tag-input [(ngModel)]="items" [maxItems]="2"></tag-input>`;
            builder.overrideTemplate(TestApp, template).createAsync(TestApp).then(fixture => {
                const component = fixture.debugElement.query(By.directive(TagInput)).componentInstance;
                component.model.value = "New Item";
                component.add();

                fixture.detectChanges();

                expect(fixture.componentInstance.items.length).toEqual(2);
                expect(component.value.length).toEqual(2);
            });
        });

        it("emits the event onAdd", (done) => {
            builder.createAsync(TestApp).then(fixture => {
                const component = fixture.debugElement.query(By.directive(TagInput)).componentInstance;
                const itemName = "New Item";

                component.model.value = itemName;

                component.onAdd.subscribe(item => {
                    expect(item).toEqual(itemName);
                    done();
                });

                component.add();
            });
        });

        it("does not allow dupes", () => {
            builder.createAsync(TestApp).then(fixture => {
                fixture.detectChanges();
                const component = fixture.debugElement.query(By.directive(TagInput)).componentInstance;
                component.model.value = "Javascript";
                component.add();
                expect(component.value.length).toEqual(2);
            });
        });
    });

    describe("when an item is removed", () => {
        it("is removed from the list", () => {
            builder.createAsync(TestApp).then(fixture => {
                fixture.detectChanges();
                const component = fixture.debugElement.query(By.directive(TagInput)).componentInstance;
                component.remove("Typescript");

                fixture.detectChanges();

                expect(component.value).toEqual(["Javascript"]);
                expect(component.input.isFocused).toEqual(true);
            });
        });

        it("emits the event onRemove", done => {
            builder.createAsync(TestApp).then(fixture => {
                fixture.detectChanges();
                const component = fixture.debugElement.query(By.directive(TagInput)).componentInstance;

                component.onRemove.subscribe(item => {
                    expect(item).toEqual("Typescript");
                    done();
                });

                component.remove("Typescript");
            });
        });

        it("is sets current selected item as undefined", () => {
            builder.createAsync(TestApp).then(fixture => {
                fixture.detectChanges();
                const component = fixture.debugElement.query(By.directive(TagInput)).componentInstance;
                const tag = 'Typescript';
                component.selectedTag = tag;

                fixture.detectChanges();

                component.remove(tag);
                expect(component.selectedTag).toBe(undefined);
            });
        });
    });
});

@Component({
    selector: 'test-app',
    template: `<tag-input 
                [(ngModel)]="items" 
                (onRemove)="onRemove($event)" 
                (onAdd)="onAdd($event)"></tag-input>`,
    directives: [TagInput]
})
class TestApp {
    public items = ['Javascript', 'Typescript'];
    public placeholder = '';

    onAdd(item) {

    }

    onRemove(item) {

    }

    ngOnInit() {

    }
}