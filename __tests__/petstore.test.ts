import { expect } from '@jest/globals';
import { PetById } from '../src/PetById.js';
import { Petstore } from '../src/Petstore.js';
import { PetsByStatus, PetStatus } from '../src/PetsByStatus.js';
import { SpyingTransport } from '../src/SpyingTransport.js';
import { AbortError, FetchError, Response } from 'node-fetch';
import { HttpError } from '../src/HttpError.js';
import { FailingTransport } from '../src/FailingTransport.js';
import { UnsupportedContentType } from '../src/UnsupportedContentType.js';

describe('Petstore API', () => {
  let petstore: Petstore;
  let transport: SpyingTransport;
  let failingTransport: FailingTransport;

  beforeEach(function (): void {
    transport = new SpyingTransport();
    failingTransport = new FailingTransport();
    petstore = new Petstore(transport);
  });

  it('should be able get pets by ID', async (): Promise<void> => {
    const petId = 4;
    const request = new PetById(petId);
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

  it('should be able to get a list of pets by status', async (): Promise<void> => {
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
    it('should be able to switch fetch implementations at runtime so tests can run properly', async (): Promise<void> => {
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

  it('should handle errors properly', async (): Promise<void> => {
    transport.responseToReturn = new Response(
      JSON.stringify({
        code: 1,
        type: 'error',
        message: 'Pet not found',
      }),
      {
        status: 404,
        statusText: 'Not Found',
      },
    );

    await expect(petstore.send(new PetById(-1))).rejects.toThrow(HttpError);
  });

  it('should handle abort errors properly', async () => {
    const abortError = new AbortError('Abort error!');
    failingTransport.exceptionToThrow = abortError;
    petstore.transport = failingTransport;

    await expect(petstore.send(new PetById(-1))).rejects.toThrow(
      new HttpError(-1, 'Request was aborted', abortError),
    );
  });

  it('should handle operational errors properly', async () => {
    const operationalError = new FetchError('Operational Error', 'system', {
      test: 'test',
    });

    failingTransport.exceptionToThrow = operationalError;
    petstore.transport = failingTransport;

    await expect(petstore.send(new PetById(-1))).rejects.toThrow(
      new HttpError(-1, 'Operational error', operationalError),
    );
  });

  it('should throw an exception when content type header returned by response is not expected', async () => {
    const expectedContentType = 'text/plain';

    transport.responseToReturn = new Response('test', {
      headers: { 'Content-Type': expectedContentType },
    });

    await expect(petstore.send(new PetById(-1))).rejects.toThrow(
      new UnsupportedContentType(expectedContentType),
    );
  });
});
