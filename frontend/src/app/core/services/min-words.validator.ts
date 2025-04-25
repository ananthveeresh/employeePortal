import { AbstractControl, ValidatorFn } from '@angular/forms';

export function minWordsValidator(minWords: number): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    if (!control.value) {
      return null; // If the control is empty, return null (no error)
    }

    const words = control.value.split(/\s+/).filter((word: string) => word.length > 0);
    if (words.length < minWords) {
      return { minWords: { requiredWords: minWords, actualWords: words.length } };
    }
    return null; // Return null if the validation passes
  };
}