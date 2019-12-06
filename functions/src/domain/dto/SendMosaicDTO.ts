export class SendMosaicDTO {
  fromPrivateKey: string
  toAddress: string
  amount: number
  constructor(init: Partial<SendMosaicDTO>) {
    Object.assign(this, init)
  }
}