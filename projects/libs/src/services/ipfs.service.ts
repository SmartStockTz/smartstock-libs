import {Injectable} from '@angular/core';
import {IPFS, create, CID} from 'ipfs';

@Injectable({
  providedIn: 'root'
})
export class IpfsService {
  private static ipfs: IPFS;

  constructor() {
    IpfsService.ensureIpfs().catch(console.log);
  }

  private static async ensureIpfs(): Promise<void> {
    if (IpfsService.ipfs) {
      return;
    }
    IpfsService.ipfs = await create();
  }

  async getDataFromCid<T>(cid: string): Promise<T> {
    IpfsService.ensureIpfs().catch(console.log);
    const results = await IpfsService.ipfs.cat(cid, {
      timeout: 1000 * 60 * 5,
    });
    IpfsService.ipfs.pin.add(CID.parse(cid)).catch(console.log);
    let data = '';
    for await (const chunk of results) {
      data += chunk.toString();
    }
    return JSON.parse(data);
  }
}
