import { Transport } from './Transport.js';
import { NodeFetchTransport } from './NodeFetchTransport.js';

export class Petstore {
  constructor(readonly transport: Transport = new NodeFetchTransport()) {}

  async send(request): Promise<Record<string, any>> {
    const response = await this.transport.execute(request);

    return await response.json();
  }
}
