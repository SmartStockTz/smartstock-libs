import { Injectable } from "@angular/core";
import { wrap } from "comlink";
import { SyncsWorker } from "../workers/syncs.worker";

@Injectable({
  providedIn: "root"
})
export class SyncsService {
  private syncsWorkerNative;
  private syncsWorker: SyncsWorker;

  async startWorker(): Promise<void> {
    if (!this.syncsWorker) {
      this.syncsWorkerNative = new Worker(
        new URL("../workers/syncs.worker", import.meta.url)
      );
      const SW = (wrap(this.syncsWorkerNative) as unknown) as any;
      this.syncsWorker = await new SW();
    }
  }

  stopWorker(): void {
    if (this.syncsWorkerNative) {
      this.syncsWorkerNative.terminate();
      this.syncsWorker = undefined;
      this.syncsWorkerNative = undefined;
    }
  }
}
