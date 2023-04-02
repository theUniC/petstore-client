import { HttpMethod, PetstoreRequest } from './PetstoreRequest.js';

export class PetById implements PetstoreRequest {
  constructor(readonly petId: number) {}

  path = (): string => `/pet/${this.petId}`;
  method = (): HttpMethod => 'GET';
}
