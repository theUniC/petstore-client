import { Response } from 'node-fetch';
import { PetstoreRequest } from './PetstoreRequest.js';
import { Transport } from './Transport.js';

export class SpyingTransport implements Transport {
  hasBeenExecuted = false;

  constructor(public responseToReturn: Response = null) {}

  async execute(_request: PetstoreRequest): Promise<Response> {
    this.hasBeenExecuted = true;
    return Promise.resolve(this.responseToReturn);
  }
}
