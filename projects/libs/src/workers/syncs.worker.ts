import {expose} from 'comlink';
import * as bfast from 'bfast';
import {ShopModel} from '../models/shop.model';
import {LibUserModel} from '../models/lib-user.model';

export function getDaasAddress(shop: ShopModel): string {
  return `https://smartstock-faas.bfast.fahamutech.com/shop/${shop.projectId}/${shop.applicationId}`;
}

export function getFaasAddress(shop: ShopModel): string {
  return `https://smartstock-faas.bfast.fahamutech.com/shop/${shop.projectId}/${shop.applicationId}`;
}

let isRunning = false;

async function saveLocalDataToServer(projectId: string): Promise<any> {
  const keys = await bfast.cache(null, projectId).getSyncsKeys();
  // const datas = await bfast.cache(null, projectId).getAllSyncs();
  for (const k of keys) {
    const data = await bfast.cache(null, projectId).getOneSyncs(k);
    if (data.action === 'delete') {
      await bfast.database(projectId).tree(data.tree)
        .query()
        .byId(data.payload.id)
        .delete({useMasterKey: true});
    }
    if (data.action === 'create' || data.action === 'update') {
      await bfast.database(projectId).tree(data.tree)
        .query()
        .byId(data.payload.id)
        .updateBuilder()
        .upsert(true)
        .doc(data.payload)
        .update();
      // console.log(r, 'after update');
    }
    await bfast.cache(null, projectId).removeOneSyncs(k);
  }
}

function getShops(user: LibUserModel): ShopModel[] {
  if (!user || !Array.isArray(user?.shops)) {
    return [];
  }
  const shops = [];
  user.shops.forEach(element => {
    shops.push(element);
  });
  shops.push({
    businessName: user.businessName,
    projectId: user.projectId,
    applicationId: user.applicationId,
    // masterKey: user.masterKey,
    projectUrlId: user.projectUrlId,
    settings: user.settings,
    ecommerce: user.ecommerce,
    street: user.street,
    country: user.country,
    region: user.region
  });
  return shops;
}

async function init(): Promise<any> {
  bfast.init({
    applicationId: 'smartstock_lb',
    projectId: 'smartstock'
  });
  const user = await bfast.auth().currentUser();
  const shops = getShops(user as any);
  if (Array.isArray(shops)) {
    for (const shop of shops) {
      if (shop && shop.applicationId && shop.projectId) {
        bfast.init({
          applicationId: shop.applicationId,
          projectId: shop.projectId,
          adapters: {
            auth: 'DEFAULT'
          },
          databaseURL: getDaasAddress(shop),
          functionsURL: getFaasAddress(shop),
        }, shop.projectId);
        await saveLocalDataToServer(shop.projectId);
      }
    }
  }
}

export class SyncsWorker {
  constructor() {
    setInterval(_1 => {
      if (isRunning === false) {
        isRunning = true;
        init().then(_2 => {
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
