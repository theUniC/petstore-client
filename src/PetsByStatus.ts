import { ContentType, PetstoreRequest } from './PetstoreRequest.js';

export enum PetStatus {
  AVAILABLE = 'available',
  PENDING = 'pending',
  SOLD = 'sold',
}

export class PetsByStatus implements PetstoreRequest {
  constructor(
    readonly status: PetStatus,
    readonly contentType: ContentType = ContentType.JSON,
  ) {}

  path = (): string => `/v2/pet/findByStatus?status=${this.status}`;

  method = ():
    | 'GET'
    | 'HEAD'
    | 'POST'
    | 'PUT'
    | 'PATCH'
    | 'DELETE'
    | 'OPTIONS' => 'GET';

  acceptHeader = (): ContentType => this.contentType;
}
