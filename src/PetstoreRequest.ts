import { PetsByStatus } from './PetsByStatus.js';
import { PetById } from './PetById.js';

export enum ContentType {
  JSON = 'application/json',
  XML = 'application/xml',
}

export type HttpMethod =
  | 'GET'
  | 'HEAD'
  | 'POST'
  | 'PUT'
  | 'PATCH'
  | 'DELETE'
  | 'OPTIONS';

export type PetStoreRequests = PetsByStatus | PetById;

export abstract class PetstoreRequest<T extends PetStoreRequests> {
  private _acceptHeader: ContentType = ContentType.JSON;

  abstract path: () => string;
  abstract method: () => HttpMethod;

  get acceptHeader(): ContentType {
    return this._acceptHeader;
  }

  withAcceptHeader(newAcceptHeader: ContentType): T {
    const clone = Object.assign(
      Object.create(Object.getPrototypeOf(this)),
      this,
    );

    clone._acceptHeader = newAcceptHeader;

    return clone;
  }
}
