import { PetstoreRequest } from './PetstoreRequest.js';

export class PetById implements PetstoreRequest {
  constructor(readonly petId: number) {}

  path = (): string => `/v2/pet/${this.petId}`;

  method = ():
    | 'GET'
    | 'HEAD'
    | 'POST'
    | 'PUT'
    | 'PATCH'
    | 'DELETE'
    | 'OPTIONS' => 'GET';
}
