export class IpfsService {
  private static instance;

  private static async ipfs(): Promise<any> {
    // const getter = async () => {
    //   let node = this.ipfsSource.getValue();
    //   if (node == null) {
    //     console.log('Waiting node creation...');
    //     // @ts-ignore
    //     node = await window.Ipfs.create();
    //     this.ipfsSource.next(node);
    //   }
    //   return node;
    // };
    // return getter();

    if (!this.instance) {
      // @ts-ignore
      this.instance = await window.Ipfs.create();
      return this.instance;
    }
    return this.instance;
  }

  private constructor() {
  }

  static async getDataFromCid<T>(cid: string): Promise<T> {
    const node = await IpfsService.ipfs();
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

  static async getId(): Promise<any> {
    const node = await this.ipfs();
    return await node.id();
  }

  static async getVersion(): Promise<any> {
    const node = await this.ipfs();
    return await node.version();
  }

  static async getStatus(): Promise<boolean> {
    const node = await this.ipfs();
    return node.isOnline();
  }
}
