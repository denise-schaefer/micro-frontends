import { useCallback, useRef, useState } from 'react';

/**
 * Augments React's useReducer() hook so that the action
 * dispatcher supports thunks.
 *
 * @param {Function} reducer
 * @param {*} initialArg
 * @param {Function} [init]
 * @returns {[*, Dispatch]}
 */
function useThunkReducer(reducer, initialArg, init = (a) => a) {
  const [hookState, setHookState] = useState(init(initialArg));

  const state = useRef(hookState);
  const getState = useCallback(() => state.current, [state]);
  const setState = useCallback(
    (newState) => {
      state.current = newState;
      setHookState(newState);
    },
    [state, setHookState]
  );

  const reduce = useCallback((action) => reducer(getState(), action), [reducer, getState]);

  /**
   * @callback Thunk
   * @param {Dispatch} dispatch
   * @param {Function} getState
   * @returns {void|*}
   */

  /**
   * @callback Dispatch
   * @param {Object|Thunk} action
   * @returns {void|*}
   */
  const dispatch = useCallback(
    (action) =>
      typeof action === 'function' ? action(dispatch, getState) : setState(reduce(action)),
    [getState, setState, reduce]
  );

  return [hookState, dispatch];
}

export default useThunkReducer;
