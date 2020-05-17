import { Injectable } from '@angular/core';
import { Plugins } from '@capacitor/core';

const { Storage } = Plugins;

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  constructor() {}

  /**
   * Saves the stringified JSON value in the key provided  *
   * @param string key - Key used to store the JSON object
   * @param string data - Stringified JSON object.
   */
  async setObject(key: string, data: string) {
    try {
      await Storage.set({
        key,
        value: btoa(escape(data)),
      });
    } catch (error) {
      console.error('Error writing to storage :', error);
    }
  }

  // get JSON object stored in the key
  async getObject(key) {
    let retrivedString,
      keyObject = {};
    try {
      retrivedString = await Storage.get({ key });
    } catch (error) {
      console.error('Error writing to storage :', error);
    }
    try {
      keyObject = JSON.parse(unescape(atob(retrivedString.value)));
    } catch (error) {
      console.error(
        'Error parsing JSON data. Empty/Corrupted storage :',
        error
      );
    }
    return keyObject;
  }

  async getKeyItem(key) {
    let encodedValue;
    let value;
    try {
      encodedValue = await Storage.get({ key });
      value = unescape(atob(encodedValue));
      console.log('Got item: ', { value: encodedValue });
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
