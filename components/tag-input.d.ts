interface TagInputComponent {
    items: string[];
    input: {
        element: HTMLElement,
        isFocused: boolean;
        isVisible(): void;
        focus(): void;
        blur(): void;
    };
    selectedTag: string;
    remove(item: string): void;
    addItem(): void;
    fireEvents(eventName: string, $event?: any);
    handleKeydown($event, item: string);
    transform(item: string);
}

export {TagInputComponent};
