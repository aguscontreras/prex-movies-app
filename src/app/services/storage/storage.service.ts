import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { BehaviorSubject } from 'rxjs';

export enum StorageKeys {
  User = 'user',
  Movies = 'movies',
  Tokens = 'tokens',
  MoviesPage = 'moviesPage',
  Genres = 'genres',
}

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  private _storage: Storage | null = null;

  private onClear = new BehaviorSubject<boolean>(false);

  onClear$ = this.onClear.asObservable();

  constructor(private storage: Storage) {
    this.init();
  }

  async init() {
    const storage = await this.storage.create();
    this._storage = storage;
  }

  public async set<T>(key: StorageKeys, value: T): Promise<T> {
    await this._storage?.set(key, value);
    return value;
  }

  public async get<T>(key: StorageKeys): Promise<T | undefined> {
    return await this.storage?.get(key);
  }

  public async remove(key: StorageKeys) {
    return await this.storage?.remove(key);
  }

  public async clear() {
    await this.storage?.clear();
    this.onClear.next(true);
  }
}
