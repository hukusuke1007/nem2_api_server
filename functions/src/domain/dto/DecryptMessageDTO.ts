export class DecryptMessageDTO {
  payload: string
  privateKey: string
  signerPublicKey: string

  constructor(init: Partial<DecryptMessageDTO>) {
    Object.assign(this, init)
  }
}