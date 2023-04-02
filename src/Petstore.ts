import { Transport } from './Transport.js';
import { NodeFetchTransport } from './NodeFetchTransport.js';
import { HttpClientException } from './HttpClientException.js';
import { UnsupportedContentTypeException } from './UnsupportedContentTypeException.js';
import { match } from 'ts-pattern';
import { ContentType, PetStoreRequests } from './PetstoreRequest.js';
import { HttpServerException } from './HttpServerException.js';
import { XMLParser } from 'fast-xml-parser';
import { z, ZodError } from 'zod';
import { Pet } from './Pet.js';
import { UnexpectedResponseFormatException } from './UnexpectedResponseFormatException.js';

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

      const data = await match(contentType)
        .with(ContentType.JSON, async () => await response.json())
        .with(ContentType.XML, async () => {
          const xmlResult = new XMLParser({ ignoreDeclaration: true }).parse(
            await response.text(),
          );
          return request
            .xmlPath()
            .split('.')
            .reduce((acc, curr) => acc[curr], xmlResult);
        })
        .otherwise(() => {
          throw new UnsupportedContentTypeException(contentType);
        });

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
