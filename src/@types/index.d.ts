type PartialK<T, K extends PropertyKey = PropertyKey> = Partial<Pick<T, Extract<keyof T, K>>> & Omit<T, K> extends infer O
    ? { [P in keyof O]: O[P] }
    : never

type RequiredK<T extends object, K extends keyof T> = Required<Pick<T, K>> & Omit<T, K>

interface TokenPayload {
    userId: string
    grpSeq: number
}

interface TokenDecoded extends TokenPayload {
    exp: number
    iat: number
    iss: string
}

/* eslint-disable @typescript-eslint/no-unused-vars */
namespace IWS {
    interface DataSync {
        type: 'dataSync'
        httpMethod: string
        url: string
        baseUrl: string
        routeParams?: any
        responseBody: any
    }
}
