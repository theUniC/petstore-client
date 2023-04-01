import { ContentType, PetstoreRequest } from './PetstoreRequest.js';

export class PetById implements PetstoreRequest {
  constructor(
    readonly petId: number,
    readonly contentType: ContentType = ContentType.JSON,
  ) {}

  acceptHeader = (): ContentType => this.contentType;

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
