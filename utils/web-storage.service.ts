/**
 * Provides a set of static methods for storing, retrieving, and manipulating data in the web storage (`localStorage` and `sessionStorage`) of a browser.
 */
class WebStorageService {
  /**
   * Stores a key-value pair in the WebStorage.
   *
   * @param {string} key - The key to be used for storing the value.
   * @param {any} value - The value to be stored.
   * @param {boolean} [inSession=false] - A flag indicating whether to store the value in the session storage or not.
   * @returns {void}
   */
  static setKey(key: string, value: any, inSession: boolean = false): void {
    const stringifiedValue: string = JSON.stringify(value);

    // If the user stored the pair inside the session storage
    const storage: Storage = inSession ? sessionStorage : localStorage;
    storage.setItem(key, stringifiedValue);
  }

  /**
   * Retrieves a key-value pair, if the key isn't found in the WebStorage, it returns null.
   *
   * @param {string} key - The key used for storing the value.
   * @param {boolean} [inSession=false] - A flag indicating whether to look for the value in the session storage or not.
   * @returns {any} The value retrieved from the storage, or null if the key is not found.
   */
  static getKey<T>(key: string, inSession: boolean = false): T | null {
    // If the user stored the pair inside the session storage
    const storage: Storage = inSession ? sessionStorage : localStorage;
    const item: T = JSON.parse(storage.getItem(key));

    return Boolean(item) ? item : null;
  }

  /**
   * Deletes a settled key-value pair in either the WebStorage.
   *
   * @param {string} key - The key used for storing the value.
   * @param {boolean} [inSession=false] - A flag indicating whether to remove the value from the session storage or not.
   * @returns {void}
   */
  static removeKey(key: string, inSession: boolean = false): void {
    // If the user stored the pair inside the session storage
    const storage: Storage = inSession ? sessionStorage : localStorage;
    storage.removeItem(key);
  }

  /**
   * Clears the entire web storage.
   *
   * @param {boolean} [inSession=false] - A flag indicating whether to clear the session storage or not.
   * @returns {void}
   */
  static clearAll(inSession: boolean = false): void {
    // If the user wants to clear the session storage
    inSession ? sessionStorage.clear() : localStorage.clear();
  }

  /**
   * Gets the current number of key-value pairs stored in the web storage.
   *
   * @param {boolean} [inSession=false] - A flag indicating whether to get the number of key-value pairs stored in the session storage or not.
   * @returns {number} The number of key-value pairs stored in the storage.
   */

  static currentLength(inSession: boolean = false): number {
    // If the user wants to get the length of the session storage
    const storage: Storage = inSession ? sessionStorage : localStorage;
    return storage.length;
  }

  /**
   * Gets the key at the specified index of the web storage.
   *
   * @param {number} index - The index of the key to retrieve.
   * @param {boolean} [inSession=false] - A flag indicating whether to get the key from the session storage or not.
   * @returns {(string | null)} The key at the
   * */
  static getKeyByIndex<T>(index: number, inSession: boolean = false): T | null {
    // If the user wants to get the key from the session storage
    const storage: Storage = inSession ? sessionStorage : localStorage;

    const item: T = JSON.parse(storage.key(index));

    return Boolean(item) ? item : null;
  }

  /**
   * Replacer function used as a callback for the `JSON.stringify` method to customize the serialization of certain types of objects,
   * specifically for the Maps and Sets
   *
   * @param key - The key of the object being serialized.
   * @param value - The value of the object being serialized.
   * @returns The serialized representation of the value object with customized serialization for Map and Set objects.
   * @see {@link https://www.builder.io/blog/maps Steve's article on Maps}
   */
  private static replacer(key: string, value: any): any {
    if (value instanceof Map) {
      return { __type: "Map", value: Object.fromEntries(value) };
    }
    if (value instanceof Set) {
      return { __type: "Set", value: Array.from(value) };
    }
    return value;
  }

  /**
   * Replacer function used as a callback for the `JSON.parse` method to customize the serialization of certain types of objects,
   * specifically for the Maps and Sets
   *
   * @param key - The key of the object being serialized.
   * @param value - The value of the object being serialized.
   * @returns The serialized representation of the value object with customized serialization for Map and Set objects.
   * @see {@link https://www.builder.io/blog/maps Steve's article on Maps}
   */
  private static reviver(key: string, value: any): any {
    switch (value?.__type) {
      case "Set": {
        return new Set(value?.value);
      }
      case "Map": {
        return new Set(value?.value);
      }

      default:
        return value;
    }
  }
}

export default WebStorageService;
