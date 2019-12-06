export class FaucetDTO {
  toAddress: string
  amount: number
  constructor(init: Partial<FaucetDTO>) {
    Object.assign(this, init)
  }
}