import { HttpMethod, PetstoreRequest } from './PetstoreRequest.js';

export class PetById implements PetstoreRequest {
  constructor(readonly petId: number) {}

  path = (): string => `/v2/pet/${this.petId}`;
  method = (): HttpMethod => 'GET';
}
