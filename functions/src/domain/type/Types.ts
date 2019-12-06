export type BlockchainAccount = {
  address: string
  privateKey: string
  publicKey: string
  network: number
}

export type BlockchainResult = {
  message: string
  data?: any
}

export enum TransactionType {
  all = 'all',                  // 全て
  transfer = 'transfer',        // 転送
  aggregate = 'aggregate',      // 集約
  mutisig = 'mutisig',          // マルチシグ（複数人の署名）
  unconfirmed = 'unconfirmed',  // 未承認
}

export enum HttpMethod {
  get = 'GET',
  post = 'POST',
  put = 'PUT',
  delete = 'DELETE',
}

export enum ResultMessage {
  success = 'success',
  failed = 'failed'
}

export enum StatusCode {
  ok = 200,
  badRequest = 400,
  internalServerError = 500
}