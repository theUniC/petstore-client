import { expect } from '@jest/globals';
import { PetById } from '../src/PetById.js';
import { Petstore } from '../src/Petstore.js';
import { PetsByStatus, PetStatus } from '../src/PetsByStatus.js';
import { SpyingTransport } from '../src/SpyingTransport.js';
import { Response } from 'node-fetch';
import { HttpClientException } from '../src/HttpClientException.js';
import { UnsupportedContentType } from '../src/UnsupportedContentType.js';
import { HttpServerException } from '../src/HttpServerException.js';
import { ContentType } from '../src/PetstoreRequest.js';

describe('Petstore API client', () => {
  let petstore: Petstore;
  let transport: SpyingTransport;

  beforeEach(function (): void {
    transport = new SpyingTransport();
    petstore = new Petstore(transport);
  });

  it('Should be able get pets by ID', async (): Promise<void> => {
    const request = new PetById(4);
    const expectedJson = {
      id: 4,
      category: {
        id: 2,
        name: 'Cat',
      },
      name: '',
      photoUrls: ['string'],
      tags: [
        {
          id: 1,
          name: 'Pet',
        },
      ],
      status: 'available',
    };

    transport.responseToReturn = new Response(JSON.stringify(expectedJson), {
      headers: { 'Content-Type': 'application/json' },
    });

    const pet = await petstore.send(request);

    expect(pet).toMatchObject(expectedJson);
  });

  it('Should be able to get a list of pets by status', async (): Promise<void> => {
    const request = new PetsByStatus(PetStatus.PENDING);
    const expectedJson = [
      {
        id: 4,
        category: {
          id: 2,
          name: 'Cat',
        },
        name: '',
        photoUrls: ['string'],
        tags: [
          {
            id: 1,
            name: 'Pet',
          },
        ],
        status: 'available',
      },
    ];

    transport.responseToReturn = new Response(JSON.stringify(expectedJson), {
      headers: { 'Content-Type': 'application/json' },
    });

    const pets = await petstore.send(request);

    expect(pets).toBeInstanceOf(Array);
  });

  describe('Given the petstore API is rather unstable', (): void => {
    it('Should be able to switch fetch implementations at runtime so tests can run properly', async (): Promise<void> => {
      const expectedJson = {
        id: 3,
        category: {
          id: 3,
          name: 'string',
        },
        name: 'doggie',
        photoUrls: ['string'],
        tags: [
          {
            id: 3,
            name: 'string',
          },
        ],
        status: 'string',
      };

      transport.responseToReturn = new Response(JSON.stringify(expectedJson), {
        headers: { 'Content-Type': 'application/json' },
      });

      await petstore.send(new PetById(3));

      expect(transport.hasBeenExecuted).toBe(true);
    });
  });

  describe('When requests fail', () => {
    it.each([
      400, 401, 402, 403, 404, 405, 406, 407, 408, 409, 410, 411, 412, 413, 414,
      415, 416, 417, 418, 421, 422, 423, 424, 425, 426, 428, 429, 431, 451,
    ])('Should handle %i error', async (statusCode: number): Promise<void> => {
      transport.responseToReturn = new Response(
        JSON.stringify({
          code: 1,
          type: 'error',
          message: 'Pet not found',
        }),
        {
          status: statusCode,
        },
      );

      await expect(petstore.send(new PetById(-1))).rejects.toThrow(
        HttpClientException,
      );
    });

    it.each([500, 501, 502, 503, 504, 505, 506, 507, 508, 510, 511])(
      'Should handle %i error',
      async (statusCode: number): Promise<void> => {
        transport.responseToReturn = new Response(
          JSON.stringify({
            code: 1,
            type: 'error',
            message: 'Pet not found',
          }),
          {
            status: statusCode,
          },
        );

        await expect(petstore.send(new PetById(-1))).rejects.toThrow(
          HttpServerException,
        );
      },
    );
  });

  it('Should throw an exception when content type header returned by response is not expected', async () => {
    const expectedContentType = 'text/plain';

    transport.responseToReturn = new Response('test', {
      headers: { 'Content-Type': expectedContentType },
    });

    await expect(petstore.send(new PetById(-1))).rejects.toThrow(
      new UnsupportedContentType(expectedContentType),
    );
  });

  it('Should be able to do requests in XML format', async () => {
    const request = new PetById(4).withAcceptHeader(ContentType.XML);
    const expectedJson = {
      Pet: {
        id: 5,
        category: {
          id: 0,
          name: 'string',
        },
        name: 'doggie',
        photoUrls: {
          photoUrl: 'string',
        },
        tags: {
          tag: {
            id: 0,
            name: 'string',
          },
        },
        status: 'string',
      },
    };

    transport.responseToReturn = new Response(
      '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Pet><category><id>0</id><name>string</name></category><id>5</id><name>doggie</name><photoUrls><photoUrl>string</photoUrl></photoUrls><status>string</status><tags><tag><id>0</id><name>string</name></tag></tags></Pet>',
      {
        headers: { 'Content-Type': 'application/xml' },
      },
    );

    const pet = await petstore.send(request);

    expect(pet).toMatchObject(expectedJson);
  });
});
