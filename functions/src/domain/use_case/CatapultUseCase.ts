import { injectable, inject } from 'inversify'
import { WalletRepository } from '../repository/WalletRepository'
import { TransactionRepository } from '../repository/TransactionRepository'
import { AggregateTransactionRepository } from '../repository/AggregateTransactionRepository'
import { SendMosaicDTO } from '../dto/SendMosaicDTO'
import { FaucetDTO } from '../dto/FaucetDTO'
import { BlockchainAccount, BlockchainResult } from '../type/Types'

export interface CatapultUseCase {
  createWallet(): BlockchainAccount
  distributeFromFaucet(dto: FaucetDTO): Promise<BlockchainResult> 
  sendMosaic(dto: SendMosaicDTO): Promise<BlockchainResult> 
  sendMosaicNoFee(dto: SendMosaicDTO): Promise<BlockchainResult>
}

@injectable()
export class CatapultUseCaseImpl implements CatapultUseCase {
  private walletRepository: WalletRepository
  private transactionRepository: TransactionRepository
  private aggregateTransactionRepository: AggregateTransactionRepository

  constructor(
    @inject('WalletRepository') walletRepository: WalletRepository,
    @inject('TransactionRepository') transactionRepository: TransactionRepository,
    @inject('AggregateTransactionRepository') aggregateTransactionRepository: AggregateTransactionRepository,
  ) {
    this.walletRepository = walletRepository
    this.transactionRepository = transactionRepository
    this.aggregateTransactionRepository = aggregateTransactionRepository
  }

  createWallet(): BlockchainAccount {
    return this.walletRepository.create()
  }

  async distributeFromFaucet(dto: FaucetDTO): Promise<BlockchainResult> {
    try {
      const sendMosaicDTO: SendMosaicDTO = {
        fromPrivateKey: process.env.FAUCET_PRIVATE_KEY,
        toAddress: dto.toAddress,
        amount: dto.amount,
      }
      return this.transactionRepository.transferTransaction(sendMosaicDTO)
    } catch (e) {
      throw e
    } 
  }

  async sendMosaic(dto: SendMosaicDTO): Promise<BlockchainResult> {
    try {
      return this.transactionRepository.transferTransaction(dto)
    } catch (e) {
      throw e
    } 
  }

  async sendMosaicNoFee(dto: SendMosaicDTO): Promise<BlockchainResult> {
    try {
      return this.aggregateTransactionRepository.transferTransactionWithNoFee(dto)
    } catch (e) {
      throw e
    } 
  }
}