import { Action } from '@ngrx/store';
import * as enUS from '../data/i-18n-en-US.json';
import * as marathi from '../data/i-18n-Marathi.json';

export function I18NReducer(state: any, action: any) {
  const languageKey = 'App-Language';
  localStorage.setItem(languageKey, action.type);
  switch (action.type.toLowerCase()) {
    case 'english':
      return (state = enUS.displayText);
    case 'marathi':
      return (state = marathi.displayText);
    default:
      localStorage.setItem(languageKey, 'english');
      return (state = enUS.displayText);
  }
}
