import { ResponseError as ResError, Codes } from '@src/common/ResponseError'

export default class CustomError extends Error {
    public errorCode: Codes

    public constructor(errorCode: Codes) {
        const { message } = ResError.get(errorCode)
        super(message)
        this.errorCode = errorCode
    }

    public get() {
        const { errorCode, message } = this
        return { errorCode, message }
    }
}
