import { Transport } from './Transport.js';
import { NodeFetchTransport } from './NodeFetchTransport.js';
import { HttpClientException } from './HttpClientException.js';
import { UnsupportedContentType } from './UnsupportedContentType.js';
import { match } from 'ts-pattern';
import { ContentType } from './PetstoreRequest.js';
import { HttpServerException } from './HttpServerException.js';

export class Petstore {
  constructor(public transport: Transport = new NodeFetchTransport()) {}

  async send(request): Promise<Record<string, any>> {
    const response = await this.transport.execute(request);

    if (response.ok) {
      const contentType = response.headers.get('content-type');
      return match(contentType as ContentType)
        .with(ContentType.JSON, async () => await response.json())
        .otherwise(() => {
          throw new UnsupportedContentType(contentType);
        });
    }

    if (response.status >= 400 && response.status < 500) {
      throw new HttpClientException(response.status, response.statusText);
    }

    throw new HttpServerException(response.status, response.statusText);
  }
}
