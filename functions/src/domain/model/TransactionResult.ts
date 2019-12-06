export class TransactionResult {
  hash: string
  isConfirmed: boolean
  data: any
  constructor(hash: string, isConfirmed: boolean, data: any) {
    this.hash = hash
    this.isConfirmed = isConfirmed
    this.data = data
  }
}
