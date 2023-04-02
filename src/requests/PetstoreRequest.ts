import { PetsByStatus } from './PetsByStatus.js';
import { PetById } from './PetById.js';

export type HttpMethod =
  | 'GET'
  | 'HEAD'
  | 'POST'
  | 'PUT'
  | 'PATCH'
  | 'DELETE'
  | 'OPTIONS';

export type PetStoreRequests = PetsByStatus | PetById;

export interface PetstoreRequest {
  path: () => string;
  method: () => HttpMethod;
}
