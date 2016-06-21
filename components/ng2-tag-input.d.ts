
interface TagInputComponent {
    model: {
        value: string;
        reset();
    };
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
}

interface TagComponent {
    item: string;
    readonly: boolean;
    isSelected: boolean;
    remove(): void;
    select(): void;
    unselect(): void;
    focus(): void;
}

interface TagTemplateComponent {

}

declare module 'ng2-tag-input' {}