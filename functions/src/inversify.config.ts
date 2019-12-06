import 'reflect-metadata'
import { Container } from 'inversify'
import { SampleUseCase, SampleUseCaseImpl } from './domain/use_case/SampleUseCase'
import { WalletRepository } from './domain/repository/WalletRepository'
import { WalletDatasource } from './infrastructure/WalletDatasource'

const container = new Container()

container.bind<WalletRepository>('WalletRepository').to(WalletDatasource)
container.bind<SampleUseCase>('SampleUseCase').to(SampleUseCaseImpl)

export default container