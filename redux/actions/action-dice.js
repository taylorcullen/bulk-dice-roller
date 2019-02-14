export const ROLL_DICE = 'ROLL_DICE';

export const RollDice = (amount) => {
    return {
        type: ROLL_DICE,
        payload: amount
    }
}