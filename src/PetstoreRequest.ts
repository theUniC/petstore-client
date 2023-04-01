export enum ContentType {
  JSON = 'application/json',
}

export interface PetstoreRequest {
  path: () => string;
  method: () =>
    | 'GET'
    | 'HEAD'
    | 'POST'
    | 'PUT'
    | 'PATCH'
    | 'DELETE'
    | 'OPTIONS';

  acceptHeader: () => ContentType;
}
