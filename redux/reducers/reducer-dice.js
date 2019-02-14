import { ROLL_DICE } from '../actions/action-dice';

const defaultState = [];

export default function reducer(state = defaultState, action) {

    switch (action.type) {
        case ROLL_DICE:
            return state;
        default:
            return state;
    }
}