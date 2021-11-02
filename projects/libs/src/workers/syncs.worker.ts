import {expose} from 'comlink';
import * as bfast from 'bfast';

bfast.init({
  applicationId: 'smartstock_lb',
  projectId: 'smartstock'
});

async function saveLocalDataToServer(): Promise<any> {
  const keys = await bfast.cache().getSyncsKeys();
  const p1 = keys.map(async k => {
    try {
      const data = await bfast.cache().getOneSyncs(k);
      if (data.projectId === undefined || data.projectId === null) {
        await bfast.cache().removeOneSyncs(k);
        return;
      }
      if (data.applicationId === undefined || data.applicationId === null) {
        await bfast.cache().removeOneSyncs(k);
        return;
      }
      if (data.databaseURL === undefined || data.databaseURL === null) {
        await bfast.cache().removeOneSyncs(k);
        return;
      }
      bfast.init({
        projectId: data.projectId,
        applicationId: data.applicationId,
        databaseURL: data.databaseURL,
        functionsURL: data.databaseURL
      }, data.projectId);
      if (data.action === 'delete') {
        await bfast.database(data.projectId).tree(data.tree)
          .query()
          .byId(data.payload.id)
          .delete({useMasterKey: true});
      }
      if (data.action === 'update') {
        await bfast.database(data.projectId).tree(data.tree)
          .query()
          .byId(data.payload.id)
          .updateBuilder()
          .upsert(true)
          .doc(data.payload)
          .update();
      }
      if (data.action === 'create') {
        data.payload.createdAt = new Date().toISOString();
        await bfast.database(data.projectId).tree(data.tree)
          .query()
          .byId(data.payload.id)
          .updateBuilder()
          .upsert(true)
          .doc(data.payload)
          .update();
      }
      await bfast.cache().removeOneSyncs(k);
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
        saveLocalDataToServer().then(_2 => {
          // console.log('done save for remove syncs');
        }).catch(reason => {
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
