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
}
