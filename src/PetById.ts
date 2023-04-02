import { HttpMethod, PetstoreRequest } from './PetstoreRequest.js';

export class PetById extends PetstoreRequest<PetById> {
  constructor(readonly petId: number) {
    super();
  }

  path = (): string => `/v2/pet/${this.petId}`;
  method = (): HttpMethod => 'GET';
  xmlPath = (): string => 'Pet';
}
