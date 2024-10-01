import DB from '../models'
const { Supply } = DB.Models

/**
 * 식자에 단위, 단위 수량 목록을 업데이트한다.
 * @returns null: seq에 따른 식자재가 없는 경우
 */
async function updateUnitList(seq: number, unit: string, unitCnt?: number) {
    const supply = await Supply.findOne({ where: { seq } })
    if (supply == null) return null
    let isUpdated = false

    if (supply.unitList.includes(unit) == false) {
        supply.unitList.push(unit)

        isUpdated = true
    }
    if (unitCnt) {
        if (supply.unitCntList == null) supply.unitCntList = []
        if (supply.unitCntList.includes(unitCnt) == false) {
            supply.unitCntList.push(unitCnt)

            isUpdated = true
        }
    }

    if (isUpdated) {
        const uSupply = await supply.save()
        return { supply: uSupply, isUpdated }
    } else {
        return { supply, isUpdated }
    }
}

export default { updateUnitList }
