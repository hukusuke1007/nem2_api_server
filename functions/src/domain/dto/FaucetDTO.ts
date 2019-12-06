export class FaucetDTO {
  address: string
  amount: number
  constructor(init: Partial<FaucetDTO>) {
    Object.assign(this, init)
  }
}