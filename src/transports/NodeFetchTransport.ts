import { PetStoreRequests } from '../requests/PetstoreRequest.js';
import fetch, { Response } from 'node-fetch';
import { Transport } from './Transport.js';

export class NodeFetchTransport implements Transport {
  constructor(private baseUrl: string) {}

  async execute(request: PetStoreRequests): Promise<Response> {
    return await fetch(`${this.baseUrl}${request.path()}`, {
      method: request.method(),
      headers: {
        Accept: 'application/json',
      },
    });
  }
}
