import {
  TransactionHttp,
  Account,
  Address,
  TransferTransaction,
  Deadline,
  NetworkCurrencyMosaic,
  AggregateTransaction,
  UInt64,
  EmptyMessage,
  HashLockTransaction,
  CosignatureTransaction,
  Listener,
  TransactionType,
} from 'nem2-sdk'
import { 
  mergeMap,
  map,
  filter,
} from 'rxjs/operators'
import { ChronoUnit } from 'js-joda'
import { BlockchainResult, ResultMessage } from '../domain/type/Types'
import { BlockchainConfigType, blockchainConfig } from '../common/Config'
import { SendMosaicDTO } from '../domain/dto/SendMosaicDTO'
import { TransactionResult } from '../domain/model/TransactionResult'
import { AggregateTransactionRepository } from '../domain/repository/AggregateTransactionRepository'
import { injectable } from 'inversify'

@injectable()
export class AggregateTransactionDataSource implements AggregateTransactionRepository {
  private node: BlockchainConfigType
  private transactionHttp: TransactionHttp

  constructor() {
    this.node = blockchainConfig
    this.transactionHttp = new TransactionHttp(this.node.endpoint)
  }

  transferTransactionWithNoFee(dto: SendMosaicDTO): Promise<BlockchainResult> {
    return new Promise((resolve, reject) => {
      console.log('AggregateTransactionDataSource', dto.fromPrivateKey, dto.toAddress, dto.amount)
      const fromAccount = Account.createFromPrivateKey(dto.fromPrivateKey, this.node.network)
      const adminPrivateKey = process.env.ADMIN_PRIVATE_KEY
      const adminAccount = Account.createFromPrivateKey(adminPrivateKey, this.node.network)

      // ユーザAがユーザBへ送金
      const toAddress = Address.createFromRawAddress(dto.toAddress)
      const deadline = Deadline.create(23, ChronoUnit.HOURS)
      const sendTransferTransaction = TransferTransaction.create(
        deadline,
        toAddress,
        [NetworkCurrencyMosaic.createRelative(dto.amount)],
        EmptyMessage,
        this.node.network,
        UInt64.fromUint(100000)
      )
      const aggregateTransaction = AggregateTransaction.createBonded(
        deadline,
        [
          sendTransferTransaction.toAggregate(fromAccount.publicAccount),   // ユーザAからBヘの送金Tx
        ],
        this.node.network,
      )
      const signedTransaction = adminAccount.sign(aggregateTransaction, this.node.generationHash)
      console.log('hash', signedTransaction.hash)

      const cosignAggregateBondedTransaction = (transaction: AggregateTransaction, account: Account) => {
        const cosignatureTransaction = CosignatureTransaction.create(transaction)
        return account.signCosignatureTransaction(cosignatureTransaction)
      }
      
      const listener = new Listener(this.node.endpoint)
      return listener.open().then(() => {
        listener
          .confirmed(adminAccount.address)
          .subscribe((result) => {
            console.log('LockFund confirmed', result.type, result.transactionInfo.hash)
            if (result.type === TransactionType.LOCK) {
              console.log('[LockFund confirmed!]')
              this.transactionHttp.announceAggregateBonded(signedTransaction)
                .subscribe((res) => {
                  console.log('announceAggregateBonded', res)
                }, (e) => reject(e))
            }
          }, (e) => reject(e))

        listener
          .aggregateBondedAdded(fromAccount.address)
          .subscribe((transaction) => {
            console.log('✅: aggregateBondedAdded')
            const signedCosignature = cosignAggregateBondedTransaction(transaction, fromAccount)
            this.transactionHttp.announceAggregateBondedCosignature(signedCosignature)
              .subscribe((res) => {
                console.log('announceAggregateBondedCosignature', res)
              }, (e) => reject(e))
          }, (e) => reject(e))

        listener
          .confirmed(fromAccount.address)
          .subscribe(res => {
            console.log('✅: Transaction confirmed')
            const txResult = new TransactionResult(signedTransaction.hash, res.isConfirmed(), res)
            resolve({
              message: ResultMessage.success,
              data: txResult
            })
            listener.close()
          }, (e) => reject(e))

        // 補償金をかける
        const lockFundsTx = HashLockTransaction.create(
          deadline,
          NetworkCurrencyMosaic.createRelative(10),
          UInt64.fromUint(480),
          signedTransaction,
          this.node.network,
          UInt64.fromUint(100000),
        )
        const hashLockTransactionSigned = adminAccount.sign(lockFundsTx, this.node.generationHash)
        this.transactionHttp
          .announce(hashLockTransactionSigned)
          .subscribe((x) => {
            console.log('hashLockTransactionSigned')
          }, (e) => {
            console.error('hashLockTransactionSigned', e)
            reject(e)
          })
      })
    })
  }
}