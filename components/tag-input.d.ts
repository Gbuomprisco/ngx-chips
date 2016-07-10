interface TagInputComponent {
    form;
    items: string[];
    input: {
        element: HTMLElement,
        isFocused: boolean;
        isVisible(): void;
        focus(): void;
    };
    remove(item: string): void;
    add(): void;
    fireEvents(eventName: string, $event?: any);
    handleKeydown($event, item: string);
    transform(item: string);
}

export {TagInputComponent};
