# PetStore API Client

## Implementation considerations

* The design has been guided all by tests
  * Most of the time I used _[Obvious Implementation](https://relentlessdevelopment.wordpress.com/2014/06/18/make-it-run-make-it-right-the-three-implementation-strategies-of-tdd/)_, although sometimes I used _Fake it, til you make it_ with _Triangulation_ and TCR (_[test && commit || revert](https://medium.com/@kentbeck_7670/test-commit-revert-870bbd756864)_) when complexity grew and baby steps were uncertain (specially happened with the content negotiation feature).
  * To find the simplest possible implementation reducing _[Accidental Complication](https://www.youtube.com/watch?v=WSes_PexXcA)_ and focusing myself on the Developer Experience with the client, I used most of the time _[Assert-First](https://medium.com/@travis_13686/assert-first-ask-questions-later-cfd3008b486d)_ except when tests were copy&pasted, like the error handling use case.
  * 
* Nearly 100% code coverage
* Fetch
* Content Negotiation
* Validation of responses both at compile-time and at runtime using Zod.
* Scalable by design
  * Dependency Injection & Dependency Inversion
  * Transports
  * Requests
  * Responses