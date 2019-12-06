import { AggregateTransactionDataSource } from '../../infrastructure/AggregateTransactionDataSource'
import { TransactionDataSource } from '../../infrastructure/TransactionDataSource'
import { WalletRepository } from '../repository/WalletRepository'
import { AggregateTransactionRepository } from '../repository/AggregateTransactionRepository'
import { TransactionRepository } from '../repository/TransactionRepository'
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
  private aggregateTransactionRepository: AggregateTransactionRepository
  private transactionRepository: TransactionRepository

  constructor(
    @inject('WalletRepository') walletRepository: WalletRepository,
    @inject('AggregateTransactionRepository') aggregateTransactionRepository: AggregateTransactionRepository,
    @inject('TransactionRepository') transactionRepository: TransactionRepository,
  ) {
    this.walletRepository = walletRepository
    this.aggregateTransactionRepository = aggregateTransactionRepository
    this.transactionRepository = transactionRepository
  }

  createWallet(): BlockchainAccount {
    return this.walletRepository.create()
  }

  async distributionMosaic(): Promise<BlockchainResult> {
    try {
      const dto: SendMosaicDTO = {
        fromPrivateKey: process.env.FAUCET_PRIVATE_KEY,
        toAddress: process.env.USER_A_ADDRESS,
        amount: 10,
      }
      const result = await this.transactionRepository.transferTransaction(dto)
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
      const result = await this.aggregateTransactionRepository.transferTransactionWithNoFee(dto)
      console.log('sendMosaicNoFee', result)
      return result
    } catch (e) {
      throw e
    } 
  }
}