export class RequestBody {
  body?: any
  
  constructor(init: Partial<RequestBody>) {
    Object.assign(this, init)
  }
}