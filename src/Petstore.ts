import { Transport } from './transports/Transport.js';
import { HttpClientException } from './exceptions/HttpClientException.js';
import { PetStoreRequests } from './requests/PetstoreRequest.js';
import { HttpServerException } from './exceptions/HttpServerException.js';
import { z, ZodError } from 'zod';
import { Pet } from './responses/Pet.js';
import { UnexpectedResponseFormatException } from './exceptions/UnexpectedResponseFormatException.js';
import { UnsupportedContentTypeException } from './exceptions/UnsupportedContentTypeException.js';

type PetstoreResponses = Pet | Pet[];

export class Petstore {
  constructor(public transport: Transport) {}

  async send<T extends z.ZodType<PetstoreResponses>>(
    request: PetStoreRequests,
    expectedSchema: T,
  ): Promise<z.infer<T>> {
    const response = await this.transport.execute(request);

    if (response.ok) {
      const contentType = response.headers.get('content-type');

      if (contentType !== 'application/json') {
        throw new UnsupportedContentTypeException(contentType);
      }

      const data = await response.json();

      try {
        return await expectedSchema.parseAsync(data);
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
