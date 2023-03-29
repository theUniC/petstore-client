import { PetstoreRequest } from './PetstoreRequest.js';
import fetch, { Response } from 'node-fetch';
import { Transport } from './Transport.js';

export class NodeFetchTransport implements Transport {
  async execute(request: PetstoreRequest): Promise<Response> {
    return await fetch(`https://petstore.swagger.io${request.path()}`, {
      method: request.method(),
      headers: {
        Accept: 'application/json',
      },
    });
  }
}
