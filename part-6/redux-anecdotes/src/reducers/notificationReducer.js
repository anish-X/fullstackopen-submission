import { createSlice } from "@reduxjs/toolkit";

const notificationSlice = createSlice({
  name: "notificaton",
  initialState: "",
  reducers: {
    setNotification(state, action) {
      return action.payload;
    },
    clearNotification(state, action) {
      return "";
    },
  },
});

export const { setNotification, clearNotification } = notificationSlice.actions;

export const showNotification = (message, sec) => {
  return (dispatch) => {
    dispatch(setNotification(message));
    setTimeout(() => {
      dispatch(clearNotification());
    }, 1000 * sec);
  };
};

export default notificationSlice.reducer;
