import { PetById } from './PetById.js';
import fetch from 'node-fetch';

export class Petstore {
  async send(request: PetById): Promise<Record<string, any>> {
    const response = await fetch(
      `https://petstore.swagger.io${request.path()}`,
      {
        method: request.method(),
        headers: {
          Accept: 'application/json',
        },
      },
    );

    return await response.json();
  }
}
