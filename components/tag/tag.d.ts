interface TagComponent {
    item: string;
    readonly: boolean;
    isSelected: boolean;
    remove(): void;
    select(): void;
    unselect(): void;
    focus(): void;
}

export {TagComponent}
