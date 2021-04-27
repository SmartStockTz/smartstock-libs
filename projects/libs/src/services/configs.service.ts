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
  public selectedModuleName = '';
  private pmenu: MenuModel[] = [];

  addMenu(menu: MenuModel): void {
    if (this.pmenu && Array.isArray(this.pmenu)) {
      const index = this.pmenu.findIndex(value => value.name === menu.name);
      if (index && index >= 0) {
        this.pmenu[index] = menu;
      } else {
        this.pmenu.push(menu);
      }
    } else {
      this.pmenu = [menu];
    }
  }

  removeMenu(name: string): boolean {
    if (this.pmenu && Array.isArray(this.pmenu)) {
      this.pmenu = this.pmenu.filter(x => x.name.trim() !== name.trim());
      return true;
    } else {
      return false;
    }
  }

  getMenu(): Array<MenuModel> {
    return this.pmenu && Array.isArray(this.pmenu) ? this.pmenu : [];
  }
}
