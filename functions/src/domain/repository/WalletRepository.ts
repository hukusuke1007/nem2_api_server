import { BlockchainAccount } from '../type/Types'

export interface WalletRepository {
  create(): BlockchainAccount
}