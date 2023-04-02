import { PetStoreRequests } from '../requests/PetstoreRequest.js';
import { Response } from 'node-fetch';

export interface Transport {
  execute(request: PetStoreRequests): Promise<Response>;
}
