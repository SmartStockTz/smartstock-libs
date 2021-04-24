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
  /**
   * @deprecated will be removed in major release
   * use #addMenu, #getMenu and #removeMenu instead to add menu.
   */
  public menu: MenuModel[] = [];
  private pmenu: MenuModel[] = [];

  addMenu(menu: MenuModel): void {
    if (this.pmenu && Array.isArray(this.pmenu)) {
      this.removeMenu(menu.name);
      try {
        this.menu.push(menu);
      } catch (e) {
      }
      this.pmenu.push(menu);
    } else {
      this.pmenu = [menu];
    }
  }

  removeMenu(name: string): boolean {
    if (this.pmenu && Array.isArray(this.pmenu)) {
      try {
        this.menu = this.menu.filter(x => x.name.trim() !== name.trim());
      } catch (e) {
      }
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
