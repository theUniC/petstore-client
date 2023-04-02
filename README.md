# PetStore API Client

## Implementation details

* The design has been guided all by tests using TDD
  * Most of the time I used _[Obvious Implementation](https://relentlessdevelopment.wordpress.com/2014/06/18/make-it-run-make-it-right-the-three-implementation-strategies-of-tdd/)_, although sometimes I used _Fake it, til you make it_ with _Triangulation_ and TCR (_[test && commit || revert](https://medium.com/@kentbeck_7670/test-commit-revert-870bbd756864)_) when complexity grew and baby steps were uncertain (specially happened with the content negotiation feature).
  * To find the simplest possible implementation reducing _[Accidental Complication](https://www.youtube.com/watch?v=WSes_PexXcA)_ and focusing myself on the Developer Experience (DX from now on) with the client, I used most of the time _[Assert-First](https://medium.com/@travis_13686/assert-first-ask-questions-later-cfd3008b486d)_ except when tests were copy&pasted, like the error handling use case.
  * I used [Outside-In TDD](https://8thlight.com/insights/tdd-from-the-inside-out-or-the-outside-in), to help me design the API client from a user standpoint. And the usage of test doubles has been very limited. I usually tend to avoid mocking frameworks like the one Jest or other frameworks provide, because they usually make your tests very tighly coupled to the code and this can lead very easily to serious testing issues like _[Fragile Tests](http://xunitpatterns.com/Fragile%20Test.html)_. So I treat [test doubles as production code](src/transports/SpyingTransport.ts) and changes to this classes are made at the same pace as production code to avoid fragile tests.
* Nearly **[100% code coverage](https://theunic.github.io/petstore-client/)**.
* I used the package [node-fetch](https://github.com/node-fetch/node-fetch) as a fetch implementation, since the fetch API in NodeJS is still in an experimental phase.
* In order to make the client simpler both at code level and at DX level, this client **only supports JSON responses**. At first, I implemented a very basic content negotiation. But almost inmediately I saw it was not worth the effort for two reasons: 1) It made the code extremely complex for 2) no benefit for the users of the client, since they would have to prepare they code for 2 different response models (the translation to an object from an XML response is different from a JSON response) having exactly the same information, increasing that way the complexity of their code. So for the sake of simplicity and to improve DX I get rid of the feature. Anyway, I created a branch (**[with-content-negotiation](https://github.com/theUniC/petstore-client/blob/with-content-negotiation/src/Petstore.ts#L27)**) in case you want to see how I have attempted to implement content negotiation.
* Easy error handling. Clients can catch several types of errors / exceptions 👇
  * 4xx responses raise an [HttpClientException](src/exceptions/HttpClientException.ts)
  * 5xx responses raise an [HttpServerException](src/exceptions/HttpServerException.ts)
  * A response with a content type different from `application/json` raises an [UnsupportedContentTypeException](src/exceptions/UnsupportedContentTypeException.ts)
  * A response with an unexpected format raises an [UnexpectedResponseFormatException](src/exceptions/UnsupportedContentTypeException.ts)
* Responses are validated both at compile-time and at runtime using **[Zod](https://zod.dev/)**.
* Scalability by design
  * _Dependency Injection & Dependency Inversion Principle_. I used dependency injection in the `Petstore` class to make the code loose coupled and able to be used in nearly all environments with the transports abstraction. Dependency Inversion Principle have been used to make the code as general as possible and to not depend on concret implementations like `fetch` and depend on more high level abstractions (like [`Transport`](src/transports/Transport.ts)) that can be switched at runtime.
  * I introduced a `Transport` abstraction as an implementation of an Adapter pattern in order to decouple from low level modules like `fetch`. So then when NodeJs fetch API reach an stable phase, it will be just a matter of creating a new `Transport` implementation with the new implementation. See [NativeFechTransport](#nativefetchtransport) code example 👇
  * It's easy to add new Requests from the Petstore API by just implementing the class `PetstoreRequest` and add the new request to the list of supported requests at file [PetstoreRequest.ts](https://github.com/theUniC/petstore-client/blob/main/src/requests/PetstoreRequest.ts#L13). See [PurchaseOrderById](#purchaseorderbyid) code example 👇
  * New responses can be added using Zod, and defining a new schema for the response and then add the new response model to list of supported responses at the file [Petstore.ts](https://github.com/theUniC/petstore-client/blob/main/src/Petstore.ts#L10). See [PurchaseOrder response model](#purchaseorder-response-model) code example 👇

### Code examples

#### NativeFetchTransport

```typescript
import { Transport } from "./Transport.js";
import { PetStoreRequests } from "./PetstoreRequest.js";

export class NativeFetchTransport implements Transport {
  constructor(private baseUrl: string) {}
  
  async execute(request: PetStoreRequests): Promise<Response> {
    return await fetch(`${this.baseUrl}${request.path()}`, {
      method: request.method(),
      headers: {
        Accept: 'application/json',
      },
    });
  }
}
```

#### PurchaseOrderById

```typescript
import { HttpMethod, PetstoreRequest } from './PetstoreRequest.js';

export class PurchaseOrderById implements PetstoreRequest {
  constructor(readonly purchaseOrderId: number) {}
  path = (): string => `/v2/store/order/${this.purchaseOrderId}`;
  method = (): HttpMethod => 'GET';
}
```

#### PurchaseOrder response model

```typescript
import { z } from 'zod';

export const PurchaseOrder = z.object({
  id: z.number(),
  petId: z.number(),
  quantity: z.number(),
  shipDate: z.string(),
  status: z.literal("placed").or(z.literal("approved")).or(z.literal("delivered"))
});

export type PurchaseOrder = z.infer<typeof PurchaseOrder>;
```

## Local development environment

I've added a small local environment based on Docker which includes 2 containers 👇

* The Petstore backend. It listens for requests at the port 8080.
* The petstore client. It's just a container with no foreground process intended to run tests without having to install all the dependencies at local host.

To run it just

    docker compose up -d

And then you should be able to see the Petstore Swagger UI at the URL 👉 http://localhost:8080/. And then to access the container just run

    docker compose run --rm petstore_client sh

