import {Injectable} from '@angular/core';
import {MenuModel} from '../models/menu.model';

@Injectable({
  providedIn: 'root'
})

export class ConfigsService {
  public versionName = '';
  public printerUrl = 'https://localhost:8080';
  public production = true;
  public electron = true;
  public browser = true;
  public menu: MenuModel[] = [];
}
