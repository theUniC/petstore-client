import { expect } from '@jest/globals';
import { PetById } from '../src/PetById.js';
import { Petstore } from '../src/Petstore.js';

describe('Petstore API', () => {
  it('should be able get pets by ID', async () => {
    const petstore = new Petstore();
    const request = new PetById(3);
    const pet = await petstore.send(request);
    expect(pet).toMatchObject({
      id: 3,
      category: {
        id: 0,
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
      status: 'available',
    });
  });
});
