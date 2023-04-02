import { HttpMethod, PetstoreRequest } from './PetstoreRequest.js';

export enum PetStatus {
  AVAILABLE = 'available',
  PENDING = 'pending',
  SOLD = 'sold',
}

export class PetsByStatus extends PetstoreRequest<PetsByStatus> {
  constructor(readonly status: PetStatus) {
    super();
  }

  path = (): string => `/v2/pet/findByStatus?status=${this.status}`;
  method = (): HttpMethod => 'GET';
  xmlPath = (): string => 'pets.Pet';
}
