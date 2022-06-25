import { Injectable } from "@angular/core";
import { FileModel } from "../models/file.model";
import { UserService } from "./user.service";
import { database, storage } from "bfast";
import { getDaasAddress } from "../utils/bfast.util";

@Injectable({
  providedIn: "root"
})
export class MediaService {
  constructor(private readonly userService: UserService) {}

  private static getFileCategory(type1: string): string {
    try {
      if (!type1) {
        return "unknown";
      }
      const fileTypes = type1.split("/");
      const type = fileTypes[0];
      if (type === "image") {
        return type;
      }
      return "other";
    } catch (e) {
      return "other";
    }
  }

  async fetchFiles(query: string): Promise<FileModel[]> {
    const shop = await this.userService.getCurrentShop();
    const files: any[] = await database(shop.projectId)
      .table("_Storage")
      .query()
      .orderBy("updatedAt", "desc")
      .searchByRegex("name", query)
      .skip(0)
      .size(50)
      .find();
    return files
      .map((x) => {
        try {
          const suffixs = x && x.name ? x.name.split("-") : "no-name";
          return {
            url: `${getDaasAddress(shop)}/storage/${shop.applicationId}/file/${
              x.id
            }`,
            size: (Number(x.size) / (1024 * 1024)).toPrecision(3) + " MB",
            suffix: suffixs[suffixs.length - 1],
            category: MediaService.getFileCategory(x.type),
            name: x.name,
            extension: x.extension,
            type: x.type,
            cid: x.cid
          };
        } catch (e) {
          return null;
        }
      })
      .filter((t) => t !== null);
  }

  async uploadFile(
    file: File,
    callback: (progress: any) => void
  ): Promise<FileModel> {
    const name = file.name.replace(new RegExp("[^a-zA-Z0-9]", "gi"), "");
    const shop = await this.userService.getCurrentShop();
    const type = file.type;
    const url = await storage(shop.projectId).save(
      {
        filename: encodeURIComponent(name),
        data: file,
        pn: true
      },
      (progress) => {
        callback(((progress.loaded / progress.total) * 100).toFixed(2));
      }
    );
    const suffixs = url.split("-");
    return {
      url,
      size: " MB",
      suffix: suffixs[suffixs.length - 1],
      name: url,
      category: MediaService.getFileCategory(type),
      type
    };
  }

  async totalFiles(query: string): Promise<number> {
    const shop = await this.userService.getCurrentShop();
    return database(shop.projectId)
      .table("_Storage")
      .query()
      .searchByRegex("name", query)
      .count(true)
      .find({ useMasterKey: true });
  }
}
