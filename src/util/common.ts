import { toDate } from 'date-fns'

/**
 * 시간 정보를 제외한 현재 날짜만 반환
 */
export function today() {
    return toDate(new Date().setHours(0, 0, 0, 0))
}
