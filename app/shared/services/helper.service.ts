import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class HelperService {
  isPhoneFormat = () => {
    return /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  };

  trimObject = (obj: Object) => {
    Object.keys(obj).forEach((key: any) => {
      if (typeof obj[key] === 'string') obj[key] = obj[key].trim();
    });
    return obj;
  };

  parseDate(date: string): Date {
    try {
      if (!date) return;
      const dates = String(date).split("/");
      return new Date(+dates[2], +dates[1] - 1, +dates[0] + 1);
    } catch (error) {
      return null;
    }
  }
  addDays(date: Date, days: number): Date {
    date.setDate(date.getDate() + days);
    return date;
  }
}
