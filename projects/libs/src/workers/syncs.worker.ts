import {expose} from 'comlink';
import * as bfast from 'bfast';

// export function getDaasAddress(shop: ShopModel): string {
//   return `https://smartstock-faas.bfast.fahamutech.com/shop/${shop.projectId}/${shop.applicationId}`;
// }
//
// export function getFaasAddress(shop: ShopModel): string {
//   return `https://smartstock-faas.bfast.fahamutech.com/shop/${shop.projectId}/${shop.applicationId}`;
// }

let isRunning = false;

async function saveLocalDataToServer(): Promise<any> {
  const keys = await bfast.cache().getSyncsKeys();
  const p1 = keys.map(async k => {
    try {
      const data = await bfast.cache().getOneSyncs(k);
      if (data.projectId === undefined || data.projectId === null) {
        await bfast.cache().removeOneSyncs(k);
      }
      if (data.applicationId === undefined || data.applicationId === null) {
        await bfast.cache().removeOneSyncs(k);
      }
      if (data.databaseURL === undefined || data.databaseURL === null) {
        await bfast.cache().removeOneSyncs(k);
      }
      if (data.action === 'delete') {
        bfast.init({
          projectId: data.projectId,
          applicationId: data.applicationId,
          databaseURL: data.databaseURL,
          functionsURL: data.databaseURL
        }, data.projectId);
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
        await bfast.database(data.projectId).tree(data.tree).save(data.payload);
      }
      await bfast.cache().removeOneSyncs(k);
    } catch (e) {
      console.log(e);
    }
  });
  await Promise.all(p1);
}

// function getShops(user: LibUserModel): ShopModel[] {
//   if (!user || !Array.isArray(user?.shops)) {
//     return [];
//   }
//   const shops = [];
//   user.shops.forEach(element => {
//     shops.push(element);
//   });
//   shops.push({
//     businessName: user.businessName,
//     projectId: user.projectId,
//     applicationId: user.applicationId,
//     // masterKey: user.masterKey,
//     projectUrlId: user.projectUrlId,
//     settings: user.settings,
//     ecommerce: user.ecommerce,
//     street: user.street,
//     country: user.country,
//     region: user.region
//   });
//   return shops;
// }

async function run(): Promise<any> {
  bfast.init({
    applicationId: 'smartstock_lb',
    projectId: 'smartstock'
  });
  await saveLocalDataToServer();
  // const user = await bfast.auth().currentUser();
  // const shops = getShops(user as any);
  // if (Array.isArray(shops)) {
  //   for (const shop of shops) {
  //     if (shop && shop.applicationId && shop.projectId) {
  //       bfast.init({
  //         applicationId: shop.applicationId,
  //         projectId: shop.projectId,
  //         adapters: {
  //           auth: 'DEFAULT'
  //         },
  //         databaseURL: getDaasAddress(shop),
  //         functionsURL: getFaasAddress(shop),
  //       }, shop.projectId);
  //       await saveLocalDataToServer(shop.projectId);
  //     }
  //   }
  // }
}

export class SyncsWorker {
  constructor() {
    setInterval(_1 => {
      if (isRunning === false) {
        isRunning = true;
        run().then(_2 => {
          // console.log('done save for remove syncs');
        }).catch(reason => {
          console.log(reason);
        }).finally(() => {
          isRunning = false;
        });
      } else {
        console.log('syncs for remote already running');
      }
    }, 2000);
  }
}

expose(SyncsWorker);
