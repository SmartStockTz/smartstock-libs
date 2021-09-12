import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class IpfsService {
  private readonly ipfsSource = new BehaviorSubject<any>(null);
  // private readonly ipfsPromise: Promise<any>;

  private get ipfs(): Promise<any> {
    const getter = async () => {
      let node = this.ipfsSource.getValue();
      if (node == null) {
        console.log('Waiting node creation...');
        // @ts-ignore
        node = await window.Ipfs.create();
        this.ipfsSource.next(node);
      }
      return node;
    };
    return getter();
  }

  constructor() {
  }

  async getDataFromCid<T>(cid: string): Promise<T> {
    const node = await this.ipfs;
    const results = await node.cat(cid, {
      timeout: 1000 * 60 * 5,
    });
    // @ts-ignore
    node.pin.add(window.Ipfs.CID.parse(cid)).catch(console.log);
    let data = '';
    for await (const chunk of results) {
      data += chunk.toString();
    }
    return JSON.parse(data);
  }

  async getId(): Promise<any> {
    const node = await this.ipfs;
    return await node.id();
  }

  async getVersion(): Promise<any> {
    const node = await this.ipfs;
    return await node.version();
  }

  async getStatus(): Promise<boolean> {
    const node = await this.ipfs;
    return node.isOnline();
  }
}
