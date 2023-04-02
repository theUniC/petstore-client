import { PetStoreRequests } from './PetstoreRequest.js';

export class UnexpectedResponseFormatException extends Error {
  constructor(request: PetStoreRequests, zodErrorMessage: string) {
    super(
      `Unexpected response from PetStore API request ${request.path()}: ${zodErrorMessage}`,
    );
  }
}
