export class HttpError extends Error {
  constructor(
    readonly statusCode: number,
    readonly statusText: string,
    readonly previous: Error = null,
  ) {
    super(
      `An HTTP ${statusCode.toString()} error occurred. Reason: ${statusText}`,
    );
  }
}
