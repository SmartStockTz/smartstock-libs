# SmartStock Libs API

List of api you can use in your smartstock module.

## Services
________________________________________________________________________________________

### [FilesService](./src/services/files.service.ts) 

Injected at root level. Handle your shop file assets, image, video, music and other raw files

### Methods

1. **async getFiles(): Promise<Array<[FileResponseModel](./src/models/file-response.model.ts)>>**

   This method return all files in a shop order by last updated.


2. **async uploadFile(file: [File](https://developer.mozilla.org/en-US/docs/Web/API/File)), callback: (progress: any) => void): Promise<string>**



