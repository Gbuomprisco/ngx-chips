interface TagComponent {
    remove(): void;
}

interface TagInputComponent {
    selectedTag: string;
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
    select(item: string);
    remove(item: string): void;
    add(): void;
    fireEvents(eventName: string, $event?: any);
    handleKeydown($event, item: string);
}

declare module 'ng2-tag-input' {}