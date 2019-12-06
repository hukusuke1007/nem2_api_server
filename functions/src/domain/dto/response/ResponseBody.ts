import { Utils } from '../../../common/Utils'

export class ResponseBody {
  status: number
  data?: any
  error?: Error

  constructor(status: number, data?: any, error?: Error) {
    this.status = status
    if (Utils.isNotNull(data)) {
      this.data = data
    }
    if (Utils.isNotNull(error)) {
      this.error = error
    }
  }
}
