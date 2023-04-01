import { Transport } from './Transport.js';
import { NodeFetchTransport } from './NodeFetchTransport.js';
import { HttpError } from './HttpError.js';
import { AbortError, FetchError } from 'node-fetch';
import { UnsupportedContentType } from './UnsupportedContentType.js';
import { match } from 'ts-pattern';
import { ContentType } from './PetstoreRequest.js';

export class Petstore {
  constructor(public transport: Transport = new NodeFetchTransport()) {}

  async send(request): Promise<Record<string, any>> {
    try {
      const response = await this.transport.execute(request);

      if (response.ok) {
        const contentType = response.headers.get('content-type');
        return match(contentType as ContentType)
          .with(ContentType.JSON, async () => await response.json())
          .otherwise(() => {
            throw new UnsupportedContentType(contentType);
          });
      }

      throw new HttpError(response.status, response.statusText);
    } catch (e) {
      if (e instanceof AbortError) {
        throw new HttpError(-1, 'Request was aborted', e);
      }

      if (e instanceof FetchError) {
        throw new HttpError(-1, 'Operational error', e);
      }

      throw e;
    }
  }
}
