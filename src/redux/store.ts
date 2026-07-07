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
import { Action, ThunkAction, configureStore } from "@reduxjs/toolkit";
import rootReducer from "./reducers";

const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(
            authApi.middleware,
            childApi.middleware,
            cartApi.middleware,
            productApi.middleware,
            wishlistApi.middleware,
            audioApi.middleware,
            reviewsApi.middleware,
            checkoutApi.middleware,
            resetApi.middleware,
        ),
});
export default store;

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppThunk<ReturnType = void> = ThunkAction<
    ReturnType,
    RootState,
    unknown,
    Action<string>
>;