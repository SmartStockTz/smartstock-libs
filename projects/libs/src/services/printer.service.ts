import {Injectable} from '@angular/core';
import {PrinterModel} from '../models/printer.model';
import {UserService} from './user.service';

@Injectable({
  providedIn: 'root',
})
export class PrintService {
  private url = `https://localhost:8080/print`;

  constructor(private readonly userService: UserService) {
  }

  setUrl(url: string): void {
    this.url = url;
  }

  getUrl(): string {
    return this.url;
  }

  async print(printModel: PrinterModel, forcePrint = false): Promise<any> {
    const cSettings = await this.userService.getSettings();
    let data = '';
    data = data.concat(cSettings.printerHeader + '\n');
    data = data.concat(printModel.data);
    data = data.concat(cSettings.printerFooter);
    printModel.data = data;
    // @ts-ignore
    if(window && window.smartstock && window.smartstock.print){
      if (!cSettings.saleWithoutPrinter || forcePrint) {
        // @ts-ignore
        return window.smartstock.print(printModel.data);
      }
      return;
    }else{
      console.log('INFO: printer is not implemented');
      return 'can not print, printer is not implemented';
    }
  }

}
