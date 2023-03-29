import { expect } from '@jest/globals';
import { PetById } from '../src/PetById.js';
import { Petstore } from '../src/Petstore.js';
import { PetsByStatus, PetStatus } from '../src/PetsByStatus.js';
import { SpyingTransport } from '../src/SpyingTransport.js';
import { AbortError, FetchError, Response } from 'node-fetch';
import { HttpError } from '../src/HttpError.js';
import { FailingTransport } from '../src/FailingTransport.js';

describe('Petstore API', () => {
  it('should be able get pets by ID', async () => {
    const petstore = new Petstore();
    const petId = 4;
    const request = new PetById(petId);
    const pet = await petstore.send(request);
    expect(pet).toMatchObject({
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
    });
  });

  it('should be able to get a list of pets by status', async () => {
    const petstore = new Petstore();
    const request = new PetsByStatus(PetStatus.PENDING);
    const pets = await petstore.send(request);
    expect(pets).toBeInstanceOf(Array);
  });

  describe('Given the petstore API is rather unstable', () => {
    it('should be able to switch fetch implementations at runtime so tests can run properly', async () => {
      const spyingTransport = new SpyingTransport(
        new Response(
          JSON.stringify({
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
          }),
        ),
      );

      const petstore = new Petstore(spyingTransport);
      await petstore.send(new PetById(3));
      expect(spyingTransport.hasBeenExecuted).toBe(true);
    });
  });

  it('should handle errors properly', async () => {
    const spyingTransport = new SpyingTransport(
      new Response(
        JSON.stringify({
          code: 1,
          type: 'error',
          message: 'Pet not found',
        }),
        {
          status: 404,
          statusText: 'Not Found',
        },
      ),
    );

    const petstore = new Petstore(spyingTransport);
    await expect(petstore.send(new PetById(-1))).rejects.toThrow(HttpError);
  });

  it('should handle abort errors properly', async () => {
    const abortError = new AbortError('Abort error!');
    const failingTransport = new FailingTransport(abortError);

    const petstore = new Petstore(failingTransport);
    await expect(petstore.send(new PetById(-1))).rejects.toThrow(
      new HttpError(-1, 'Request was aborted', abortError),
    );
  });

  it('should handle operational errors properly', async () => {
    const operationalError = new FetchError('Operational Error', 'system', {
      test: 'test',
    });

    const failingTransport = new FailingTransport(operationalError);

    const petstore = new Petstore(failingTransport);
    await expect(petstore.send(new PetById(-1))).rejects.toThrow(
      new HttpError(-1, 'Operational error', operationalError),
    );
  });
});
