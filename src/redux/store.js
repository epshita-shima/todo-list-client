import { configureStore } from "@reduxjs/toolkit";
import boardviewReducer from "./boards/boardSlice";
import userViewReducer from "./user/userSlice";
const store = configureStore({
  reducer: {
    boardview: boardviewReducer,
    userView: userViewReducer,
  },
  // middleware: (getDefaultMiddleware) =>
  //   getDefaultMiddleware().concat(api.middleware),
});

export default store;
