export class UnsupportedContentType extends Error {
  constructor(unsupportedContentType: string) {
    super(`Unsupported content-type: ${unsupportedContentType}`);
  }
}
