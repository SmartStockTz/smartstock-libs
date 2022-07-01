import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { cache, isElectron } from 'bfast';
import { firstValueFrom } from 'rxjs';
import { ChoosePrinterDialog } from '../components/choose-printer';
import { PrinterModel } from '../models/printer.model';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root',
})
export class PrintService {
  private DEFAULT_PRINTER_KEY = 'default_printer';
  private url = `https://localhost:8080/print`;

  constructor(
    private readonly userService: UserService,
    private readonly dialog: MatDialog,
    private readonly httpClient: HttpClient
  ) {
  }

  setUrl(url: string): void {
    this.url = url;
  }

  getUrl(): string {
    return this.url;
  }

  async getDefaultPrinterName() {
    return cache().get(this.DEFAULT_PRINTER_KEY);
  }

  async showChoosePrinter(): Promise<string> {
    const r = this.dialog.open(ChoosePrinterDialog).afterClosed();
    const a = await firstValueFrom(r);
    if (a) {
      await cache().set(this.DEFAULT_PRINTER_KEY, a);
    }
    return a;
  }

  async printers(): Promise<string[]> {
    // @ts-ignore
    if (window && window.smartstock && window.smartstock.printers) {
      // @ts-ignore
      return window.smartstock.printers();
    }
    return [];
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
    if (!isElectron) {
      console.log('can not print in web browser');
      return 'can not print in web browser';
    }
    // @ts-ignore
    // if (window && window.smartstock && window.smartstock.print) {
    if (!cSettings.saleWithoutPrinter || forcePrint) {
      return await this.printInDesktop(printModel);
      // let printerName = await this.getDefaultPrinterName();
      // if (!printerName) {
      //   printerName = await this.showChoosePrinter();
      // }
      // // @ts-ignore
      // return window.smartstock.print(printModel.data, printerName);
    }
    return;
    // } else {
    //   console.log('INFO: printer is not implemented');
    //   return 'can not print, printer is not implemented';
    // }
  }

}
