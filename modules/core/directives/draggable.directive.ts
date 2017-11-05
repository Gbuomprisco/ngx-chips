import { 
    Directive, 
    EventEmitter, 
    forwardRef, 
    HostBinding,
    HostListener,
    Inject, 
    Input,
    Output 
} from '@angular/core';

import { TagInputComponent } from '../../components/tag-input';
import { DragProvider, DraggedTag } from '../providers';
import { TagModel } from '../accessor';

@Directive({
    selector: '[drag]'
})
export class DraggableDirective {
    @Input() public drag: string;
    @Input() public item: TagModel;
    @Input() public zone: string;
    @Input() public index: number;

    @Output() public onItemDropped = new EventEmitter();
    @Output() public onItemDraggedOut = new EventEmitter();

    @HostListener('dragstart', ['$event'])
    public onDragStart($event) {
        this.onDragStarted($event, this.item, this.index);
    }

    @HostListener('drop', ['$event'])
    public onDrop($event) {
        this.onTagDropped($event, this.index);
    }

    @HostListener('dragenter', ['$event'])
    public onDragEnter($event) {
        this.onDragOver($event);
    }

    @HostListener('dragover', ['$event'])
    public _onDragOver($event) {
        this.onDragOver($event);
    }

    @HostListener('dragleave', ['$event'])
    public onDragLeave() {
        this.dragProvider.onDragEnd();
    }

    /**
     * @name isDropping
     */
    @HostBinding('class.ng2-tag-input--dropping')
    public get isDropping(): boolean {
        const isReceiver = this.dragProvider.receiver === this.tagInput;
        const isDropping = this.dragProvider.getState('dropping');

        return Boolean(isReceiver && isDropping);
    }

    constructor(
        @Inject(forwardRef(() => TagInputComponent)) private readonly tagInput: TagInputComponent, 
        private readonly dragProvider: DragProvider) {}

    /**
     * @name onDragStarted
     * @param event
     * @param index
     */
    private onDragStarted(event: DragEvent, tag: TagModel, index: number): void {
        event.stopPropagation();

        const item = { zone: this.drag, tag, index } as DraggedTag;
        
        this.dragProvider.setSender(this.tagInput);
        this.dragProvider.setDraggedItem(event, item);
        this.dragProvider.setState({dragging: true, index});
    }

    /**
     * @name onDragOver
     * @param event
     */
    private onDragOver(event: DragEvent, index?: number): void {
        this.dragProvider.setState({dropping: true});
        this.dragProvider.setReceiver(this.tagInput);

        event.preventDefault();
    }

    /**
     * @name onTagDropped
     * @param event
     * @param index
     */
    private onTagDropped(event: DragEvent, index: number): void {
        const item = this.dragProvider.getDraggedItem(event);
        const { sender, receiver } = this.dragProvider;

        if (item.zone !== this.drag) {
            return;
        }

        this.dragProvider.onDragEnd();
        
        sender.onRemoveRequested.call(sender, item.tag, item.index);
        receiver.onAddingRequested.call(receiver, false, item.tag, index);
    
        event.preventDefault();
        event.stopPropagation();
    }
}