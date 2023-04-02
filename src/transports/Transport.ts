import { PetStoreRequests } from './PetstoreRequest.js';
import { Response } from 'node-fetch';

export interface Transport {
  execute(request: PetStoreRequests): Promise<Response>;
}
