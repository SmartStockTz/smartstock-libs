import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LogService {

  constructor() {
  }

  i(message: any, tag?: string, debug = false): void {
    if (debug) {
      console.log(tag, message);
    }
  }

  e(message: any, tag?: string, debug = false): void {
    if (debug) {
      console.error(tag, message);
    }
  }

  w(message: any, tag?: string, debug = false): void {
    if (debug) {
      console.warn(tag, message);
    }
  }
}
