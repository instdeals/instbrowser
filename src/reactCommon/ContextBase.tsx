import { Callback } from "../tsCommon/baseTypes";
import { useState, useMemo, createContext, useEffect, ReactNode } from "react";
import React from "react";

export class StateApi<StateType> {
  state: StateType;
  setStateCallback: Callback<StateType>;
  stateKey: string | null = null;

  constructor(state: StateType, setState: Callback<StateType>, stateKey: string | null = null) {
    this.state = state;
    this.setStateCallback = setState;
    this.stateKey = stateKey;
  }

  /* Override this to debug state changes */
  debugState(newState: StateType) { }

  setState(newState: StateType) {
    this.debugState(newState);
    this.state = newState;
    this.setStateCallback(newState);
  }
}

export function createStateApiProvider<StateType, StateApi>(
  initialState: StateType,
  context: any,
  createApiCallback: (state: StateType, setState: any) => StateApi) {
  return function (props: any) {
    const { children } = props;
    const [state, setState] = useState(initialState);
    const api = useMemo(() => createApiCallback(initialState, setState), []);
    const contextValue = useMemo(() => ({ api, state }), [api, state]);

    const Provider = context.Provider;
    return <Provider value={contextValue}>{children}</Provider>
  }
}

export function createStateApiProviderWithLoader<Type, Api extends StateApi<Type>>(
  initialState: Type,
  context: any,
  createApiCallback: (state: Type, setState: any) => Api,
  loader: (setState: any) => any,
  suspendView?: ReactNode | undefined) {

  return function (props: any) {
    const { children } = props;
    const [state, setState] = useState(initialState);
    const api = useMemo(() => createApiCallback(initialState, setState), []);
    const contextValue = useMemo(() => ({ api, state }), [api, state]);
    const [loaded, setLoaded] = useState(false);
    useEffect(() => {
      loader((state: Type) => {
        api.setState(state);
        setLoaded(true);
      });
    }, [api]);

    const Provider = context.Provider;
    return <Provider value={contextValue}>
      {(loaded || !suspendView) ? children : suspendView}
    </Provider>
  }
}

export function createStateApiContext<StateType, StateApi>() {
  return createContext<{ state: StateType, api: StateApi } | null>(null);
}