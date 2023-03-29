export class PetById {
  constructor(readonly petId: number) {}

  path = () => `/v2/pet/${this.petId}`;

  method(): 'GET' | 'HEAD' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'OPTIONS' {
    return 'GET';
  }
}
