import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'textCapitalize'
})
export class TextCapitalizePipe implements PipeTransform {

  transform(value: string): string {
    if (!value) return '';
    
    return value.toLowerCase().replace(/\b\w/g, char => char.toUpperCase());
  }

}
