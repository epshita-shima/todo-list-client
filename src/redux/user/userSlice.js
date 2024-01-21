import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchUserInfo = createAsyncThunk("getInfo", async () => {
  try {
    const response = await axios.get(
      `https://todo-list-server-production-e6e8.up.railway.app/info`
    );
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching tasks:", error);
    throw error;
  }
});
export const fetchUserInfoDetails = createAsyncThunk(
  "getUserInfo",
  async () => {
    try {
      const response = await axios.get(
        `https://todo-list-server-production-e6e8.up.railway.app/info`
      );
      console.log(response.data);
      return response.data;
    } catch (error) {
      console.error("Error fetching tasks:", error);
      throw error;
    }
  }
);
export const fetchUserInfoPost = createAsyncThunk(
  "insertUserData",
  async (data) => {
    console.log(data);
    try {
      const response = await axios.post(
        `https://todo-list-server-production-e6e8.up.railway.app/info`,
        data
      );
      const insertData = JSON.parse(response.config.data);
      return insertData;
    } catch (error) {
      console.error("Error fetching tasks:", error);
      throw error;
    }
  }
);

const userSlice = createSlice({
  name: "user",
  initialState: { data: [], previousUser: [] },
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(fetchUserInfo.fulfilled, (state, action) => {
        const userInfo = action.payload;
        state.data = userInfo;
      })
      .addCase(fetchUserInfoPost.fulfilled, (state, action) => {
        state.data = action.payload;
      })
      .addCase(fetchUserInfoDetails.fulfilled, (state, action) => {
        const userInfo = action.payload;
        state.previousUser = userInfo;
      });
  },
});

export default userSlice.reducer;
