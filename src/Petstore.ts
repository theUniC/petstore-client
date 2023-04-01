import { Transport } from './Transport.js';
import { NodeFetchTransport } from './NodeFetchTransport.js';
import { HttpClientException } from './HttpClientException.js';
import { UnsupportedContentType } from './UnsupportedContentType.js';
import { match } from 'ts-pattern';
import { ContentType } from './PetstoreRequest.js';
import { HttpServerException } from './HttpServerException.js';
import { XMLParser } from 'fast-xml-parser';

export class Petstore {
  constructor(public transport: Transport = new NodeFetchTransport()) {}

  async send(request): Promise<Record<string, any>> {
    const response = await this.transport.execute(request);

    if (response.ok) {
      const contentType = response.headers.get('content-type');
      return match(contentType)
        .with(ContentType.JSON, async () => await response.json())
        .with(ContentType.XML, async () =>
          new XMLParser({ ignoreDeclaration: true }).parse(
            await response.text(),
          ),
        )
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
