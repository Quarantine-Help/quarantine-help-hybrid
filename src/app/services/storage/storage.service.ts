import { Injectable } from '@angular/core';
import { Plugins } from '@capacitor/core';

const { Storage } = Plugins;

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  constructor() {}

  // JSON set
  async setObject(key: string, data: string) {
    try {
      await Storage.set({
        key,
        value: data,
      });
    } catch (error) {
      console.error('Error writing to storage :', error);
    }
  }

  // JSON get
  async getObject(key) {
    let retrivedString, keyObject;
    try {
      retrivedString = await Storage.get({ key });
    } catch (error) {
      console.error('Error writing to storage :', error);
    }
    try {
      keyObject = JSON.parse(retrivedString.value);
    } catch (error) {
      console.error('Error parsing JSON data :', error);
    }
    console.log(keyObject);
    return keyObject;
  }

  async getKeyItem(key) {
    let value;
    try {
      value = await Storage.get({ key });
      console.log('Got item: ', { value });
    } catch (error) {
      console.error('Error parsing JSON data :', error);
    }
    return { value };
  }

  async getAllKeys() {
    let keys;
    try {
      keys = await Storage.keys();
      console.log('Got keys: ', { keys });
    } catch (error) {
      console.error('Error parsing JSON data :', error);
    }
    return { keys };
  }

  async removeKeyItem(key) {
    try {
      await Storage.remove({ key });
      console.log('Removed key: ', { key });
    } catch (error) {
      console.error('Error parsing JSON data :', error);
    }
  }
}
