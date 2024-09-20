import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'highlight',
  standalone: true,
})
export class HighlightPipe implements PipeTransform {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  transform(text: any, search: string, searchKey?: string): any {
    // eslint-disable-next-line no-useless-escape
    let pattern = search.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&');
    pattern = pattern
      .split(' ')
      .filter(t => {
        return t.length > 0;
      })
      .join('|');
    const regex = new RegExp(pattern, 'i');

    if (!search) {
      return text;
    }

    if (searchKey) {
      const name = text[searchKey].replace(regex, match => `<b>${match}</b>`);
      // copy original object
      const textCopied = { ...text };
      // set bold value into searchKey of copied object
      textCopied[searchKey] = name;
      return textCopied;
    } else {
      return search ? text.replace(regex, match => `<b>${match}</b>`) : text;
    }
  }
}
