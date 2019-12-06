export class TransactionDetail {
  id: string
  mosaics: Mosaic[]
  fee: number
  fromAddress: string
  toAddress: string
  message: Message
  signerPublicKey: string
  hash: string
  date: Date

  static sortByDate(items: TransactionDetail[]): TransactionDetail[] {
    return items.sort((a, b) => {
      const aTime = a.date!.getTime()
      const bTime = b.date!.getTime()
      if (aTime > bTime) { return -1 }
      if (aTime < bTime) { return 1 }
      return 0
    })
  }

  constructor(id: string, mosaics: Mosaic[], fee: number, fromAddress: string, toAddress: string,
    message: Message, signerPublicKey: string, hash: string, date: Date) {
    this.id = id
    this.mosaics = mosaics
    this.fee = fee
    this.fromAddress = fromAddress
    this.toAddress = toAddress
    this.message = message
    this.signerPublicKey = signerPublicKey
    this.hash = hash
    this.date = date
  }
}

export class Mosaic {
  id: string
  amount: number
  constructor(id: string, amount: number) {
    this.id = id
    this.amount = amount
  }
}

export class Message {
  payload: string
  isEncrypt: boolean
  constructor(payload: string, isEncrypt: boolean) {
    this.payload = payload
    this.isEncrypt = isEncrypt
  }
}