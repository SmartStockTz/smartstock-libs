import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class ConfigsService {
  static versionName = '';
  static printerUrl = 'https://localhost:8080';
  static production = true;
  static electron = true;
  static browser = true;
}
