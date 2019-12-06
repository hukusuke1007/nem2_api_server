import { AggregateTransactionDataSource } from '../../infrastructure/AggregateTransactionDataSource'
import { TransactionDataSource } from '../../infrastructure/TransactionDataSource'
import { WalletRepository } from '../repository/WalletRepository'
import { SendMosaicDTO } from '../dto/SendMosaicDTO'
import { injectable, inject } from 'inversify'
import { BlockchainAccount, BlockchainResult } from '../type/Types'

export interface SampleUseCase {
  createWallet(): BlockchainAccount
  distributionMosaic(): Promise<BlockchainResult> 
  sendMosaicNoFee(): Promise<BlockchainResult>
}

@injectable()
export class SampleUseCaseImpl implements SampleUseCase {

  private walletRepository: WalletRepository

  constructor(
    @inject('WalletRepository') walletRepository: WalletRepository
  ) {
    this.walletRepository = walletRepository
  }

  createWallet(): BlockchainAccount {
    return this.walletRepository.create()
  }

  async distributionMosaic(): Promise<BlockchainResult> {
    try {
      const dto: SendMosaicDTO = {
        fromPrivateKey: process.env.ADMIN_PRIVATE_KEY,
        toAddress: process.env.USER_A_ADDRESS,
        amount: 10,
      }
      const repository = new TransactionDataSource()
      const result = await repository.transferTransaction(dto)
      console.log('distributionMosaic', result)
      return result
    } catch (e) {
      throw e
    } 
  }

  async sendMosaicNoFee(): Promise<BlockchainResult> {
    try {
      const dto: SendMosaicDTO = {
        fromPrivateKey: process.env.USER_A_PRIVATE_KEY,
        toAddress: process.env.USER_B_ADDRESS,
        amount: 2,
      }
      const repository = new AggregateTransactionDataSource()
      return repository.transferTransactionWithNoFee(dto)
    } catch (e) {
      throw e
    } 
  }
}