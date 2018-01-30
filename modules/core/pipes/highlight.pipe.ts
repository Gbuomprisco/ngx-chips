import {Pipe, PipeTransform} from '@angular/core';

const escape = s => s.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');

@Pipe({
    name: 'highlight'
})
export class HighlightPipe implements PipeTransform {
    /**
     * @name transform
     * @param value {string}
     * @param arg {string}
     */
    public transform(value: string, arg: string): string {
        if (!arg.trim()) {
            return value;
        }

        try {
            const regex = new RegExp(`(${escape(arg)})`, 'i');
            return value.replace(regex, '<b>$1</b>');
        } catch (e) {
            return value;
        }
    }
}
