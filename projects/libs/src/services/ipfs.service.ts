export class IpfsService {
  private static instance;

  private static async ipfs(): Promise<any> {
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
    const dt = JSON.parse(data);
    if (dt?._id) {
      dt.id = dt._id;
      delete dt._id;
    }
    if (dt?._created_at) {
      dt.createdAt = dt._created_at;
      delete dt._created_at;
    }
    if (dt?._updated_at) {
      dt.updatedAt = dt._updated_at;
      delete dt._updated_at;
    }
    return dt;
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
