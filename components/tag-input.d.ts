interface TagInputComponent {
    items: string[];
    input: {
        element: HTMLElement,
        isFocused: boolean;
        focus(): void;
        blur(): void;
    };
    selectedTag: string;
    removeItem(item: string): void;
    addItem(): void;
    selectItem(item: string);
    fireEvents(eventName: string, $event?: any);
    handleKeydown($event, item: string);
    transform(item: string);
}

export {TagInputComponent};
