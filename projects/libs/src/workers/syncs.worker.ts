import {expose} from 'comlink';
import {cache, database, init} from 'bfast';

init({
  applicationId: 'smartstock_lb',
  projectId: 'smartstock'
});
async function saveLocalDataToServer(): Promise<any> {
  const keys = await cache().getSyncsKeys();
  const p1 = keys.map(async k => {
    try {
      const data = await cache().getOneSyncs(k);
      if (data.projectId === undefined || data.projectId === null) {
        await cache().removeOneSyncs(k);
        return;
      }
      if (data.applicationId === undefined || data.applicationId === null) {
        await cache().removeOneSyncs(k);
        return;
      }
      if (data.databaseURL === undefined || data.databaseURL === null) {
        await cache().removeOneSyncs(k);
        return;
      }
      init({
        projectId: data.projectId,
        applicationId: data.applicationId,
        databaseURL: data.databaseURL,
        functionsURL: data.databaseURL,
        adapters: {
          http: 'DEFAULT',
          cache: 'DEFAULT',
          auth: 'DEFAULT'
        }
      }, data.projectId);
      if (data.action === 'delete') {
        await database(data.projectId).tree(data.tree)
          .query()
          .byId(data.payload.id)
          .delete({useMasterKey: true});
      }
      if (data.action === 'update') {
        await database(data.projectId).tree(data.tree)
          .query()
          .byId(data.payload.id)
          .updateBuilder()
          .upsert(true)
          .doc(data.payload)
          .update();
      }
      if (data.action === 'create') {
        data.payload.createdAt = new Date().toISOString();
        await database(data.projectId).tree(data.tree)
          .query()
          .byId(data.payload.id)
          .updateBuilder()
          .upsert(true)
          .doc(data.payload)
          .update();
      }
      await cache().removeOneSyncs(k);
    } catch (e) {
      console.log(e);
    }
  });
  await Promise.all(p1);
}

export class SyncsWorker {
  isRunning = false;
  constructor() {
    console.log('syncs worker started');
    setInterval(_1 => {
      if (this.isRunning === false) {
        this.isRunning = true;
        saveLocalDataToServer().then(_2 => {}).catch(reason => {
          console.log(reason);
        }).finally(() => {
          this.isRunning = false;
        });
      } else {
        console.log('syncs for remote already running');
      }
    }, 3000);
  }
}

expose(SyncsWorker);
