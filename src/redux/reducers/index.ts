/* eslint-disable */
import { authApi } from "@/api/authApiSlice";
import { cartApi } from "@/api/cartApiSlice";
import { checkoutApi } from "@/api/checkoutApiSlice";
import { childApi } from "@/api/childApiSlice";
import { productApi } from "@/api/productApiSlice";
import { resetApi } from "@/api/resetPassApiSlice";
import { wishlistApi } from "@/api/wishlistApiSlice";
import { audioApi } from "@/api/audioApiSlice";
import { reviewsApi } from "@/api/reviewsApiSlice";
import { combineReducers, Action } from "redux";
import auth, { AuthState } from "./auth";
import settings, { SettingsState } from "./settings";

export interface RootState {
  auth: AuthState;
  settings: SettingsState;
  [authApi.reducerPath]: ReturnType<typeof authApi.reducer>;
  [childApi.reducerPath]: ReturnType<typeof childApi.reducer>;
  [cartApi.reducerPath]: ReturnType<typeof cartApi.reducer>;
  [productApi.reducerPath]: ReturnType<typeof productApi.reducer>;
  [wishlistApi.reducerPath]: ReturnType<typeof wishlistApi.reducer>;
  [audioApi.reducerPath]: ReturnType<typeof audioApi.reducer>;
  [reviewsApi.reducerPath]: ReturnType<typeof reviewsApi.reducer>;
  [checkoutApi.reducerPath]: ReturnType<typeof checkoutApi.reducer>;
  [resetApi.reducerPath]: ReturnType<typeof resetApi.reducer>;
}
const appReducer = combineReducers({
  auth,
  settings,
  [authApi.reducerPath]: authApi.reducer,
  [childApi.reducerPath]: childApi.reducer,
  [cartApi.reducerPath]: cartApi.reducer,
  [productApi.reducerPath]: productApi.reducer,
  [wishlistApi.reducerPath]: wishlistApi.reducer,
  [audioApi.reducerPath]: audioApi.reducer,
  [reviewsApi.reducerPath]: reviewsApi.reducer,
  [checkoutApi.reducerPath]: checkoutApi.reducer,
  [resetApi.reducerPath]: resetApi.reducer,
});
const rootReducer = (state: RootState | undefined, action: Action<any>) => {
  return appReducer(state as never, action);
};
export default rootReducer;