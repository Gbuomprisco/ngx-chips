import {TagComponent} from '../tag/tag.d.ts';

interface TagInputComponent {
    form;
    value: string[];
    input: {
        element: HTMLElement,
        isFocused: boolean;
        isVisible(): void;
        focus(): void;
    };
    remove(item: TagComponent): void;
    add(): void;
    fireEvents(eventName: string, $event?: any);
    handleKeydown($event, item: string);
    transform(item: string);
}

export {TagInputComponent, TagComponent};
