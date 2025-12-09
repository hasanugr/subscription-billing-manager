"use client";

import {
  useDispatch,
  useSelector,
  type TypedUseSelectorHook,
} from "react-redux";
import type { WebRootState, WebAppDispatch } from "./store";

export const useAppDispatch = () => useDispatch<WebAppDispatch>();
export const useAppSelector: TypedUseSelectorHook<WebRootState> = useSelector;
