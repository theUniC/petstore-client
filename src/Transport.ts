import { PetstoreRequest } from './PetstoreRequest.js';
import { Response } from 'node-fetch';

export interface Transport {
  execute(request: PetstoreRequest): Promise<Response>;
}
