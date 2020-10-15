import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PlatformService {

  constructor() {
  }

  async isDesktop(): Promise<boolean> {
    return  false;
    // try {
    //   const info = await Capacitor.Plugins.Device.getInfo();
    //   return info.platform === 'electron';
    // } catch (e) {
    //   throw e;
    // }
  }

  async isMobile(): Promise<boolean> {
    return  false;
    // try {
    //   const info = await Capacitor.Plugins.Device.getInfo();
    //   return info.platform === ('ios' || 'android');
    // } catch (e) {
    //   throw e;
    // }
  }

  async isWeb(): Promise<boolean> {
    return true;
    // try {
    //   const info = await Capacitor.Plugins.Device.getInfo();
    //   return info.platform === 'web';
    // } catch (e) {
    //   throw e;
    // }
  }
}
