import {
  TransactionHttp,
  Account,
  Address,
  TransferTransaction,
  Deadline,
  NetworkCurrencyMosaic,
  AggregateTransaction,
  PlainMessage,
  EncryptedMessage,
  LockFundsTransaction,
  PublicAccount,
  UInt64,
  EmptyMessage,
  HashLockTransaction,
  CosignatureSignedTransaction,
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
import { ListenerHelper } from './helper/ListenerHelper'
import { BlockchainResult, ResultMessage } from '../domain/type/Types'
import { BlockchainConfigType, blockchainConfig } from '../common/Config'
import { SendMosaicDTO } from '../domain/dto/SendMosaicDTO'

export class AggregateTransactionDataSource {
  private node: BlockchainConfigType
  private transactionHttp: TransactionHttp

  constructor() {
    this.node = blockchainConfig
    this.transactionHttp = new TransactionHttp(this.node.endpoint)
  }

  transferTransactionWithNoFee(dto: SendMosaicDTO): Promise<BlockchainResult> {
    return new Promise((resolve, reject) => {
      console.log('AggregateTransactionDataSource', dto.fromPrivateKey, dto.toAddress)
      const fromAccount = Account.createFromPrivateKey(dto.fromPrivateKey, this.node.network)
      const fromPublicAccount= fromAccount.publicAccount
      const fromAddress = fromAccount.address

      const deadline = Deadline.create(23, ChronoUnit.HOURS)
      // Adminアカウントが手数料分のNEMを送信
      const adminPrivateKey = process.env.ADMIN_PRIVATE_KEY
      const adminAccount = Account.createFromPrivateKey(adminPrivateKey, this.node.network)
      const adminAddress = adminAccount.address
      const adminPublicAccount = adminAccount.publicAccount
      const adminTransferTransaction = TransferTransaction.create(
        deadline,
        fromAddress,
        [NetworkCurrencyMosaic.createRelative(7)],
        EmptyMessage,
        this.node.network,
        UInt64.fromUint(20000)
      )

      // ユーザAがユーザBへ送金
      const toAddress = Address.createFromRawAddress(dto.toAddress)
      const sendTransferTransaction = TransferTransaction.create(
        deadline,
        toAddress,
        [NetworkCurrencyMosaic.createRelative(dto.amount)],
        EmptyMessage,
        this.node.network,
        UInt64.fromUint(20000)
      )

      const aggregateTransaction = AggregateTransaction.createBonded(
        deadline,
        [
          adminTransferTransaction.toAggregate(adminPublicAccount), // 手数料分のTx
          sendTransferTransaction.toAggregate(fromPublicAccount),   // ユーザAからBヘの送金Tx
        ],
        this.node.network
      )
      const signedTransaction = adminAccount.sign(aggregateTransaction, this.node.generationHash)
      console.log('hash', signedTransaction.hash)
      const listener = new ListenerHelper(this.node.endpoint)
      listener.aggregateLoadStatus(
        adminAddress,
        fromAddress,
        signedTransaction.hash,
        (transaction) => {
          if (transaction.type === TransactionType.LOCK) {
            console.log('[LockFund confirmed!]')
            this.transactionHttp.announceAggregateBonded(signedTransaction)
              .subscribe((res) => {
                console.log(res)
              })
          }
        },
        (res) => {
          this.cosignAggregateBondedTransaction(res, fromAccount)
        },
      ).then((res) => { 
        const result: BlockchainResult = {
          message: ResultMessage.success,
          data: res
        }
        resolve(result)
      })
      .catch((e) => reject(e))

      // 補償金をかける
      const lockFundsTx = LockFundsTransaction.create(
        deadline,
        NetworkCurrencyMosaic.createRelative(10),
        UInt64.fromUint(480),
        signedTransaction,
        this.node.network,
        UInt64.fromUint(20000),
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
  }

  cosignAggregateBondedTransaction(transaction: AggregateTransaction, account: Account): CosignatureSignedTransaction {
    const cosignatureTransaction = CosignatureTransaction.create(transaction)
    return account.signCosignatureTransaction(cosignatureTransaction)
  }
}