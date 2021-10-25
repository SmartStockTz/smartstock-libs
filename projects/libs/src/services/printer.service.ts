import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {NavigationService} from './navigation.service';
import {PrinterModel} from '../models/printer.model';
import {UserService} from './user.service';

@Injectable({
  providedIn: 'root',
})
export class PrintService {
  url: string;

  constructor(private readonly userService: UserService,
              private readonly navigationService: NavigationService,
              private readonly httpClient: HttpClient) {
  }

  private async printInDesktop(printModel: PrinterModel): Promise<any> {
    this.url = `${this.navigationService.printerUrl}/print`;
    return this.httpClient.post(this.url, {
      data: printModel.data,
      id: printModel.id
    }, {
      headers: {
        'Access-Control-Allow-Origin': '*'
      },
      responseType: 'text'
    }).toPromise();
  }

  async print(printModel: PrinterModel, forcePrint = false): Promise<any> {
    const cSettings = await this.userService.getSettings();
    let data = '';
    data = data.concat(cSettings.printerHeader + '\n');
    data = data.concat(printModel.data);
    data = data.concat(cSettings.printerFooter);

    printModel.data = data;

    // if (!ConfigsService.production) {
    //   console.warn('print services disabled in dev mode');
    //   return;
    // }

    // // console.log(cSettings.saleWithoutPrinter);
    // if (ConfigsService.android && !cSettings.saleWithoutPrinter) {
    //   return 'done printing';
    // }

    if (typeof process === 'undefined' && forcePrint === false) {
      return 'can not print in web browser';
    }

    if (!cSettings.saleWithoutPrinter || forcePrint) {
      return await this.printInDesktop(printModel);
    }

    // if (!cSettings.saleWithoutPrinter) {
    //   return await this.printInDesktop(printModel);
    // }

    return;
  }

}
