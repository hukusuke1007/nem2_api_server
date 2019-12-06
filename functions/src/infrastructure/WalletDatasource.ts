import { Account } from 'nem2-sdk'
import { BlockchainAccount } from '../domain/type/Types'
import { BlockchainConfigType, blockchainConfig } from '../common/Config'
import { WalletRepository } from '../domain/repository/WalletRepository'
import { injectable } from 'inversify'

@injectable()
export class WalletDatasource implements WalletRepository {
  node: BlockchainConfigType
  
  constructor() {
    this.node = blockchainConfig
  }

  create(): BlockchainAccount {
    const account = Account.generateNewAccount(this.node.network)
    const result: BlockchainAccount = {
      address: account.address.plain(),
      privateKey: account.privateKey,
      publicKey: account.publicKey,
      network: account.address.networkType.valueOf(),
    }
    return result
  }
}