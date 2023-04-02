# PetStore API Client

## Implementation considerations

* The design has been guided all by tests
  * Most of the time I used _[Obvious Implementation](https://relentlessdevelopment.wordpress.com/2014/06/18/make-it-run-make-it-right-the-three-implementation-strategies-of-tdd/)_, although sometimes I used _Fake it, til you make it_ with _Triangulation_ and TCR (_[test && commit || revert](https://medium.com/@kentbeck_7670/test-commit-revert-870bbd756864)_) when complexity grew and baby steps were uncertain (specially happened with the content negotiation feature).
  * To find the simplest possible implementation reducing _[Accidental Complication](https://www.youtube.com/watch?v=WSes_PexXcA)_ and focusing myself on the Developer Experience (DX from now on) with the client, I used most of the time _[Assert-First](https://medium.com/@travis_13686/assert-first-ask-questions-later-cfd3008b486d)_ except when tests were copy&pasted, like the error handling use case.
  * I used [Outside-In TDD](https://8thlight.com/insights/tdd-from-the-inside-out-or-the-outside-in), to help me design the API from a consumer standpoint. And the usage of test doubles has been very limited. I usually tend to avoid mocking frameworks like the one Jest or other frameworks provide, because they usually make your tests very tighly coupled to the code and this can lead very easily to serious testing issues like _[Fragile Tests](http://xunitpatterns.com/Fragile%20Test.html)_. So I treat [test doubles as production code](src/transports/SpyingTransport.ts) and changes to this classes are made at the same pace as production code to avoid fragile tests.
* Nearly **[100% code coverage](https://theunic.github.io/petstore-client/)**.
* I used the package [node-fetch](https://github.com/node-fetch/node-fetch) as a fetch implementation, since the fetch API in NodeJS is still in an experimental phase.
* In order to make the client simpler both at code level and at DX level, this client **only supports JSON responses**. At first, I implemented a very basic content negotiation. But almost inmediately I saw it was not worth the effort for two reasons: 1) It made the code extremely complex for 2) no benefit for the users of the client, since they would have to prepare they code for 2 different response models (the translation to an object from an XML response is different from a JSON response) having exactly the same information, increasing that way the complexity of their code. So for the sake of simplicity and to improve DX I get rid of the feature. Anyway, I created a branch (**[with-content-negotiation](https://github.com/theUniC/petstore-client/blob/with-content-negotiation/src/Petstore.ts#L27)**) in case you want to see how I have attempted to implement content negotiation.
* Easy error handling for clients.
* Validation of responses both at compile-time and at runtime using Zod.
* Scalable by design
  * Dependency Injection & Dependency Inversion
  * Transports
  * Requests
  * Responses

## Local development environment

TBD