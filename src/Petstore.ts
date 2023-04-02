import { Transport } from './Transport.js';
import { NodeFetchTransport } from './NodeFetchTransport.js';
import { HttpClientException } from './HttpClientException.js';
import { PetStoreRequests } from './PetstoreRequest.js';
import { HttpServerException } from './HttpServerException.js';
import { z, ZodError } from 'zod';
import { Pet } from './Pet.js';
import { UnexpectedResponseFormatException } from './UnexpectedResponseFormatException.js';
import { UnsupportedContentTypeException } from './UnsupportedContentTypeException.js';

type PetstoreResponses = Pet | Pet[];

export class Petstore {
  constructor(public transport: Transport = new NodeFetchTransport()) {}

  async send<T extends z.ZodType<PetstoreResponses>>(
    request: PetStoreRequests,
    expected: T,
  ): Promise<z.infer<T>> {
    const response = await this.transport.execute(request);

    if (response.ok) {
      const contentType = response.headers.get('content-type');

      if (contentType !== 'application/json') {
        throw new UnsupportedContentTypeException(contentType);
      }

      const data = await response.json();

      try {
        return await expected.parseAsync(data);
      } catch (zodError) {
        if (zodError instanceof ZodError) {
          throw new UnexpectedResponseFormatException(
            request,
            zodError.message,
          );
        }

        throw zodError;
      }
    }

    if (response.status >= 400 && response.status < 500) {
      throw new HttpClientException(response.status, response.statusText);
    }

    throw new HttpServerException(response.status, response.statusText);
  }
}
