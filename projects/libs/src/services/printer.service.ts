import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {NavigationService} from './navigation.service';
import {PrinterModel} from '../models/printer.model';
import {UserService} from './user.service';
import {firstValueFrom} from 'rxjs';
import {isNode} from 'bfast';

@Injectable({
  providedIn: 'root',
})
export class PrintService {
  private url = `https://localhost:8080/print`;

  constructor(private readonly userService: UserService,
              private readonly navigationService: NavigationService,
              private readonly httpClient: HttpClient) {
  }

  setUrl(url: string): void {
    this.url = url;
  }

  getUrl(): string {
    return this.url;
  }

  private async printInDesktop(printModel: PrinterModel): Promise<any> {
    const o = this.httpClient.post(this.url, {
      data: printModel.data,
      id: printModel.id
    }, {
      headers: {
        'Access-Control-Allow-Origin': '*'
      },
      responseType: 'text'
    });
    return firstValueFrom(o);
  }

  async print(printModel: PrinterModel, forcePrint = false): Promise<any> {
    const cSettings = await this.userService.getSettings();
    let data = '';
    data = data.concat(cSettings.printerHeader + '\n');
    data = data.concat(printModel.data);
    data = data.concat(cSettings.printerFooter);
    printModel.data = data;
    if (!isNode) {
      console.log('can not print in web browser');
      return 'can not print in web browser';
    }
    if (!cSettings.saleWithoutPrinter || forcePrint) {
      return await this.printInDesktop(printModel);
    }
    return;
  }

}
