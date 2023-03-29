import { PetstoreRequest } from './PetstoreRequest.js';
import { Response } from 'node-fetch';
import { Transport } from './Transport.js';

export class FailingTransport implements Transport {
  constructor(public exceptionToThrow: Error) {}

  execute(_request: PetstoreRequest): Promise<Response> {
    throw this.exceptionToThrow;
  }
}
