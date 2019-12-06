export class Utils {
  static sleep(time: number) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
          resolve()
      }, time)
    })
  }
  static isNotNull = (data: any) => data !== undefined && data !== null ? true : false
  static isNull = (data: any) => data === undefined || data === null ? true : false
  static dateFromObjectId = (objectId: string) => new Date(parseInt(objectId.substring(0, 8), 16) * 1000)
}