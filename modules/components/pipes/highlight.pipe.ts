import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
    name: 'highlight'
})
export class HighlightPipe implements PipeTransform {
    transform(value: string, arg: string): string {
        if (!arg.trim()) {
            return value;
        }

        const regex = new RegExp(`(${arg})`, 'i');
        return value.replace(regex, '<b>$1</b>');
    }
}
