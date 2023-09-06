import { FormControl } from '@angular/forms';

export function emailValidator(control: FormControl): {
  [s: string]: boolean;
} {
  const value = control.value;
  const expression: RegExp = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
  return expression.test(value) || value === 'admin' ? null : { email: true };
}
