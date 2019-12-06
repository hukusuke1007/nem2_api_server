import {
  Account,
  Address,
  AggregateTransaction,
  CosignatureSignedTransaction,
  CosignatureTransaction,
  Listener,
  Transaction,
} from 'nem2-sdk'
import { map, filter, mergeMap, skip, first, timeout } from 'rxjs/operators'
import { TransactionResult } from '../../domain/model/TransactionResult'

// https://nemtech.github.io/ja/guides/monitor/monitoring-a-transaction-status.html
export class ListenerHelper {
  endpoint: string
  listener: Listener

  constructor(endpoint: string) {
    this.endpoint = endpoint
    this.listener = new Listener(this.endpoint)
  }

  async loadStatus(address: Address, hash: string): Promise<TransactionResult> {
    return new Promise((resolve, reject) => {
      const amountOfConfirmationsToSkip = 5
      this.listener.open().then(() => {
        // newBlock
        const newBlockSubscription = this.listener
          .newBlock()
          .pipe(timeout(30000))
          .subscribe(block => {
            console.log('New block created:' + block.height.compact())
          }, error => {
            console.error(error)
            reject(error)
            this.listener.terminate()
          })
        
        // error
        this.listener
          .status(address)
          .pipe(filter(error => error.hash === hash))
          .subscribe(error => {
            console.log('❌:' + error.status)
            newBlockSubscription.unsubscribe()
            this.listener.close()
            reject(error)
          }, error => reject(error))
        
        // unconfirmed
        this.listener
          .unconfirmedAdded(address)
          .pipe(filter(transaction => (transaction.transactionInfo !== undefined
              && transaction.transactionInfo.hash === hash)))
          .subscribe(res => {
            console.log('⏳: Transaction status changed to unconfirmed')
            newBlockSubscription.unsubscribe()
            this.listener.close()
            resolve(new TransactionResult(hash, res.isConfirmed(), res))
          }, error => reject(error))
        
        // confirmed
        this.listener
          .confirmed(address)
          .pipe(
            filter(transaction =>(transaction.transactionInfo !== undefined
                && transaction.transactionInfo.hash === hash)),
            mergeMap(transaction => {
                return this.listener.newBlock()
                  .pipe(
                    skip(amountOfConfirmationsToSkip),
                    first(),
                    map( ignored => transaction))
            }))
          .subscribe(res => {
              console.log('✅: Transaction confirmed')
              resolve(new TransactionResult(hash, res.isConfirmed(), res))
              newBlockSubscription.unsubscribe()
              this.listener.close()
          }, e => reject(e))

      }).catch(e => reject(e))
    })
  }

  async confirmed(
    address: Address,
  ): Promise<Transaction> {
    return new Promise((resolve, reject) => {
      this.listener.open().then(() => {
        this.listener
          .aggregateBondedAdded(address)
          .subscribe((transaction) => {
            console.log('✅: aggregateBondedAdded')
          }, (e) => reject(e))

        this.listener
          .confirmed(address)
          .subscribe((res) => {
            resolve(res)
            // this.listener.close()
          }, (e) => reject(e))

      }).catch(e => reject(e))
    })
  }

  async aggregateBondedAddedConfirmed(
    address: Address,
    hash: string,
    callback: (transaction: AggregateTransaction) => void, 
  ): Promise<TransactionResult> {
    return new Promise((resolve, reject) => {
      this.listener.open().then(() => {
        this.listener
          .aggregateBondedAdded(address)
          .subscribe((transaction) => {
            console.log('✅: aggregateBondedAdded')
            callback(transaction)
          }, (e) => reject(e))

        this.listener
          .confirmed(address)
          .subscribe(res => {
            console.log('✅: Transaction confirmed')
            resolve(new TransactionResult(hash, res.isConfirmed(), res))
            this.listener.close()
          }, (e) => reject(e))
      }).catch(e => reject(e))
    })
  }

  // async aggregateLoadStatus(
  //   adminAddress: Address,
  //   fromAddress: Address,
  //   hash: string,
  //   lockFund: (transaction: Transaction) => void, 
  //   aggregateBondedAdded: (transaction: AggregateTransaction) => void,
  // ): Promise<TransactionResult> {
  //   console.log(adminAddress.plain(), '=>', fromAddress.plain())
  //   return new Promise((resolve, reject) => {
  //     this.listener.open().then(() => {
    
  //       this.listener
  //         .confirmed(adminAddress)
  //         .subscribe((result) => {
  //           console.log('LockFund confirmed', result.type, result.transactionInfo.hash)
  //           lockFund(result)
  //         }, (e) => reject(e))

  //       this.listener
  //         .confirmed(fromAddress)
  //         .subscribe(res => {
  //           console.log('✅: Transaction confirmed')
  //           resolve(new TransactionResult(hash, res.isConfirmed(), res))
  //           this.listener.close()
  //         }, (e) => reject(e))

  //       this.listener
  //         .aggregateBondedAdded(fromAddress)
  //         .subscribe((transaction) => {
  //           console.log('✅: aggregateBondedAdded')
  //           aggregateBondedAdded(transaction)
  //         }, (e) => reject(e))
      
  //     }).catch(e => reject(e))
  //   })
  // }
}
