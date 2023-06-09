export class UnsupportedContentTypeException extends Error {
  constructor(unsupportedContentType: string) {
    super(`Unsupported content-type: ${unsupportedContentType}`);
  }
}
