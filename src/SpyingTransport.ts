import { Response } from 'node-fetch';
import { PetstoreRequest } from './PetstoreRequest.js';
import { Transport } from './Transport.js';

export class SpyingTransport implements Transport {
  hasBeenExecuted = false;

  constructor(public responseToReturn: Response) {}

  async execute(_request: PetstoreRequest) {
    this.hasBeenExecuted = true;
    return Promise.resolve(this.responseToReturn);
  }
}
