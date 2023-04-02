import { HttpMethod, PetstoreRequest } from './PetstoreRequest.js';

export enum PetStatus {
  AVAILABLE = 'available',
  PENDING = 'pending',
  SOLD = 'sold',
}

export class PetsByStatus implements PetstoreRequest {
  constructor(readonly status: PetStatus) {}

  path = (): string => `/pet/findByStatus?status=${this.status}`;
  method = (): HttpMethod => 'GET';
}
