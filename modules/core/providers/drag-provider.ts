import { TagInputComponent } from '../../components/tag-input/tag-input';
import { TagModel } from '../accessor';

import { Injectable } from '@angular/core';

export declare interface DraggedTag {
    index: number;
    tag: TagModel;
    zone: string;
}

import { DRAG_AND_DROP_KEY } from '../../core/constants';

export declare interface State {
    dragging: boolean,
    dropping: boolean,
    index: number | undefined
}

export declare type StateProperty = keyof State;

@Injectable()
export class DragProvider {
    public sender: TagInputComponent;
    public receiver: TagInputComponent;

    public state: State = {
        dragging: false,
        dropping: false,
        index: undefined
    };

    /**
     * @name setDraggedItem
     * @param event
     * @param tag
     */
    public setDraggedItem(event: DragEvent, tag: DraggedTag): void {
        event.dataTransfer.setData(DRAG_AND_DROP_KEY, JSON.stringify(tag));
    }

    /**
     * @name getDraggedItem
     * @param event
     */
    public getDraggedItem(event: DragEvent): DraggedTag {
        const data = event.dataTransfer.getData(DRAG_AND_DROP_KEY);

        return JSON.parse(data) as DraggedTag;
    }

    /**
     * @name setSender
     * @param sender
     */
    public setSender(sender: TagInputComponent): void {
        this.sender = sender;
    }

    /**
     * @name setReceiver
     * @param receiver
     */
    public setReceiver(receiver: TagInputComponent): void {
        this.receiver = receiver;
    }

    /**
     * @name onTagDropped
     * @param tag
     * @param indexDragged
     * @param indexDropped
     */
    public onTagDropped(tag: TagModel, indexDragged: number, indexDropped?: number): void {
        this.onDragEnd();

        this.sender.onRemoveRequested(tag, indexDragged);
        this.receiver.onAddingRequested(false, tag, indexDropped);
    }

    /**
     * @name setState
     * @param state
     */
    public setState(state: {[K in StateProperty]?: State[K]}): void {
        this.state = {...this.state, ...state};
    }

    /**
     * @name getState
     * @param key
     */
    public getState(key?: StateProperty): State | State[StateProperty] {
        return key ? this.state[key] : this.state;
    }

    /**
     * @name onDragEnd
     */
    public onDragEnd(): void {
        this.setState({
            dragging: false,
            dropping: false,
            index: undefined
        });
    }
}
