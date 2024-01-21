import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchTasks = createAsyncThunk("getData", async () => {
  try {
    const response = await axios.get(
      `https://todo-list-server-production-e6e8.up.railway.app/task`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching tasks:", error);
    throw error;
  }
});

export const fetchTasksPost = createAsyncThunk("insertData", async (data) => {
  try {
    const response = await axios.post(
      `https://todo-list-server-production-e6e8.up.railway.app/task`,
      data
    );
    const insertData = JSON.parse(response.config.data);
    return insertData;
  } catch (error) {
    console.error("Error fetching tasks:", error);
    throw error;
  }
});

export const fetchTaskById = createAsyncThunk("updateData", async (data) => {
  try {
    const response = await axios.put(
      `https://todo-list-server-production-e6e8.up.railway.app/task/${data._id}`,
      {
        data,
      }
    );
    const validData = JSON.parse(response.config.data);
    return validData.data;
  } catch (error) {
    console.error("Error fetching tasks:", error);
    throw error;
  }
});

export const fetchTaskDelete = createAsyncThunk("deleteData", async (id) => {
  try {
    const response = await axios.delete(
      `https://todo-list-server-production-e6e8.up.railway.app/task/${id}`
    );
    console.log(response);
  } catch (error) {
    console.error("Error fetching tasks:", error);
    throw error;
  }
});

//drag and drop
export const fetchUpdateTasks = createAsyncThunk("update", async (data) => {
  const response = await fetch(
    `https://todo-list-server-production-e6e8.up.railway.app/project`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data[0]),
    }
  );
  try {
    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Error fetching tasks:", error);
    throw error;
  }
});

const boardSlice = createSlice({
  name: "board",
  initialState: {
    toDo: {
      name: "ToDo",
      items: [],
      isLoading: false,
      isError: false,
      error: null,
    },
    inProgress: {
      name: "In Progress",
      items: [],
      isLoading: false,
      isError: false,
      error: null,
    },
    unitTest: {
      name: "Unit Test",
      items: [],
      isLoading: false,
      isError: false,
      error: null,
    },
    qualityAssurance: {
      name: "Quality Assurance",
      items: [],
      isLoading: false,
      isError: false,
      error: null,
    },
    completed: {
      name: "Completed",
      items: [],
      isLoading: false,
      isError: false,
      error: null,
    },
  },
  reducers: {
    taskMove: (state, action) => {
      const { source, destination } = action.payload;
      if (source.droppableId != destination.droppableId) {
        const sourceList = state[source.droppableId].items;
        const destinationList = state[destination.droppableId].items;
        const [movedItem] = sourceList.splice(source.index, 1);
        destinationList.splice(destination.index, 0, movedItem);
      } else {
        const column = state[source.droppableId].items;
        const copiedItems = [...column.items];
        const [removed] = copiedItems.splice(source.index, 1);
        copiedItems.splice(destination.index, 0, removed);
      }
    },
  },
  extraReducers(builder) {
    builder
      .addCase(fetchTasks.pending, (state) => {
        state.toDo.isLoading = true;
        state.toDo.isError = false;
        state.toDo.error = null;
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        const allData = action.payload;
        const dataCollectionTodo = allData?.filter(
          (ele) =>
            ele.status == "toDo" || ele.status == null || ele.status == ""
        );
        const dataCollectionInProggess = allData?.filter(
          (ele) => ele.status == "inProgress"
        );
        const dataCollectionUnitTest = allData?.filter(
          (ele) => ele.status == "unitTest"
        );
        const dataCollectionQA = allData?.filter(
          (ele) => ele.status == "qualityAssurance"
        );

        const dataCollection = allData?.filter(
          (ele) => ele.status == "completed"
        );
        state.toDo.items = dataCollectionTodo;
        state.inProgress.items = dataCollectionInProggess;
        state.unitTest.items = dataCollectionUnitTest;
        state.qualityAssurance.items = dataCollectionQA;
        state.completed.items = dataCollection;
        state.toDo.isLoading = false;
        state.unitTest.isLoading = false;
      })
      .addCase(fetchTasks.rejected, (state, action) => {})

      .addCase(fetchTasksPost.fulfilled, (state, action) => {
        state.toDo.items.push(action.payload);
      })
      .addCase(fetchUpdateTasks.fulfilled, (state, action) => {})
      .addCase(fetchTaskById.pending, (state, action) => {
        state.toDo.isLoading = true;
        state.toDo.isError = false;
        state.toDo.error = null;
      })
      .addCase(fetchTaskById.fulfilled, (state, action) => {
        if (
          action.payload.status == null ||
          action.payload.status == "" ||
          action.payload.status == "unitTest"
        ) {
          state.unitTest.items = state.unitTest.items.map((item) =>
            item._id === action.payload._id ? action.payload : item
          );
        }
        if (action.payload.status == "toDo") {
          state.toDo.items = state.toDo.items.map((item) =>
            item._id === action.payload._id ? action.payload : item
          );
        }
        if (action.payload.status == "inProgress") {
          state.inProgress.items = state.inProgress.items.map((item) =>
            item._id === action.payload._id ? action.payload : item
          );
        }
        if (action.payload.status == "qualityAssurance") {
          state.qualityAssurance.items = state.qualityAssurance.items.map(
            (item) => (item._id === action.payload._id ? action.payload : item)
          );
        }
        if (action.payload.status == "completed") {
          state.completed.items = state.completed.items.map((item) =>
            item._id === action.payload._id ? action.payload : item
          );
        }

        state.unitTest.isLoading = false;
        state.toDo.isLoading = false;
        state.inProgress.isLoading = false;
        state.qualityAssurance.isLoading = false;
        state.completed.isLoading = false;
      })

      .addCase(fetchTaskDelete.pending, (state) => {
        state.unitTest.isLoading = true;
        state.unitTest.isError = false;
        state.unitTest.error = null;
        state.toDo.isLoading = true;
        state.toDo.isError = false;
        state.toDo.error = null;
      })
      .addCase(fetchTaskDelete.fulfilled, (state, action) => {
        const id = action.meta.arg;
        if (id) {
          state.toDo.items = state.toDo.items.filter((ele) => ele._id !== id);

          state.qualityAssurance.items = state.qualityAssurance.items.filter(
            (ele) => ele._id !== id
          );
          state.inProgress.items = state.inProgress.items.filter(
            (ele) => ele._id !== id
          );
          state.unitTest.items = state.unitTest.items.filter(
            (ele) => ele._id !== id
          );

          state.completed.items = state.completed.items.filter(
            (ele) => ele._id !== id
          );
        }
        state.toDo.isLoading = false;
        state.unitTest.isLoading = false;
        state.inProgress.isLoading = false;
        state.qualityAssurance.isLoading = false;
        state.completed.isLoading = false;
      })
      .addCase(fetchTaskDelete.rejected, (state) => {
        state.toDo.isLoading = false;
        state.toDo.isError = true;
      });
  },
});
export const { taskMove } = boardSlice.actions;
export default boardSlice.reducer;
