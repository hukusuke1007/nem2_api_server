import * as dotenv from 'dotenv'
dotenv.config()
import * as V1 from './presentation/v1'
export const v1 = { ...V1 }