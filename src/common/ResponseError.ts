import { Response } from 'express'
import HttpStatusCodes from './HttpStatusCodes'

// 대분류 100 단위, 중분류 10 단위, 소분류 1씩 증가
export enum Codes {
    // 1 ~ 99 인증
    LOGIN_FAIL = 10,
    LOGIN_FAIL_EXCEED = 11,
    TOKEN_EXPIRED = 20,
    TOKEN_INVALID_INFO = 30,
    // 100 ~ 199 기타
    NOT_EXIST_ID = 100,
    ALEADY_EXIST_ID = 101,
    BAD_ROUTE_PARAM = 110,
    BAD_BODY = 120,
    // 200 ~ * 리소스 관련
    // 제품정보
    EXIST_PRDINFO_NAME = 200,
}

const INFO = {
    [Codes.LOGIN_FAIL]: {
        errorCode: Codes.LOGIN_FAIL,
        message: '아이디 또는 비밀번호가 일치하지 않습니다',
    },
    [Codes.LOGIN_FAIL_EXCEED]: {
        errorCode: Codes.LOGIN_FAIL_EXCEED,
        message: '로그인 시도 횟수를 초과하였습니다',
    },
    [Codes.TOKEN_EXPIRED]: {
        errorCode: Codes.TOKEN_EXPIRED,
        message: '토큰이 만료되었습니다',
    },
    [Codes.TOKEN_INVALID_INFO]: {
        errorCode: Codes.TOKEN_INVALID_INFO,
        message: '토큰 정보가 올바르지 않습니다',
    },
    [Codes.NOT_EXIST_ID]: {
        errorCode: Codes.NOT_EXIST_ID,
        message: '해당 식별키가 존재하지 않습니다',
    },
    [Codes.ALEADY_EXIST_ID]: {
        errorCode: Codes.ALEADY_EXIST_ID,
        message: '해당 식별키가 이미 존재합니다.',
    },
    [Codes.BAD_ROUTE_PARAM]: {
        errorCode: Codes.BAD_ROUTE_PARAM,
        message: '잘못된 경로 파라미터 입니다.',
    },
    [Codes.BAD_BODY]: {
        errorCode: Codes.BAD_BODY,
        message: '잘못된 요청 본문 입니다.',
    },
    [Codes.EXIST_PRDINFO_NAME]: {
        errorCode: Codes.EXIST_PRDINFO_NAME,
        message: '동일한 제품명이 존재합니다',
    },
}

function get(code: Codes) {
    return INFO[code]
}

function getBadBody(keys: string[]) {
    return { ...get(Codes.BAD_BODY), keys }
}

export function converNumRes(val: string, res: Response) {
    const result = +val
    if (isNaN(result)) {
        res.status(HttpStatusCodes.BAD_REQUEST).send(ResponseError.get(Codes.BAD_ROUTE_PARAM))
        return 0
    } else {
        return result
    }
}

export const ResponseError = { INFO, get, getBadBody }
