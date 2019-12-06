import {
  TransactionHttp,
  Account,
  Address,
  TransferTransaction,
  Deadline,
  NetworkCurrencyMosaic,
  PlainMessage,
  UInt64,
  Mosaic,
  MosaicId,
  NetworkType,
  EmptyMessage,
} from 'nem2-sdk'
import { ListenerHelper } from './helper/ListenerHelper'
import { BlockchainResult, ResultMessage } from '../domain/type/Types'
import { BlockchainConfigType, blockchainConfig } from '../common/Config'
import { SendMosaicDTO } from '../domain/dto/SendMosaicDTO'
import { ChronoUnit } from 'js-joda'

export class TransactionDataSource {
  private node: BlockchainConfigType
  private transactionHttp: TransactionHttp

  constructor() {
    this.node = blockchainConfig
    this.transactionHttp = new TransactionHttp(this.node.endpoint)
  }

  transferTransaction(dto: SendMosaicDTO): Promise<BlockchainResult> {
    return new Promise((resolve, reject) => {
      const recipientAddress = Address.createFromRawAddress(dto.toAddress)
      const transferTransaction = TransferTransaction.create(
        Deadline.create(23, ChronoUnit.HOURS),
        recipientAddress,
        [NetworkCurrencyMosaic.createRelative(dto.amount)],
        EmptyMessage,
        NetworkType.MIJIN_TEST,
        UInt64.fromUint(20000)
      )
      const account = Account.createFromPrivateKey(dto.fromPrivateKey, this.node.network)
      const signedTransaction = account.sign(transferTransaction, this.node.generationHash)
      const listener = new ListenerHelper(this.node.endpoint)
      listener.loadStatus(account.address, signedTransaction.hash)
        .then((res) => { 
          const result: BlockchainResult = {
            message: ResultMessage.success,
            data: res
          }
          resolve(result)
        })
        .catch((error) => reject(error))
      this.transactionHttp
        .announce(signedTransaction)
        .subscribe(
          (response) => console.log(response),
          (error) => reject(error))
    })
  }
}