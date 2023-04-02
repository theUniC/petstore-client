import { Response } from 'node-fetch';
import { PetStoreRequests } from '../requests/PetstoreRequest.js';
import { Transport } from './Transport.js';

export class SpyingTransport implements Transport {
  hasBeenExecuted = false;

  constructor(public responseToReturn: Response = null) {}

  async execute(_request: PetStoreRequests): Promise<Response> {
    this.hasBeenExecuted = true;
    return Promise.resolve(this.responseToReturn);
  }
}
