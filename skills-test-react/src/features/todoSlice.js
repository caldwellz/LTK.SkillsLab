import { createSlice } from '@reduxjs/toolkit';

const initialState = [];

const todosSlice = createSlice({
  name: 'todos',
  initialState,
  reducers: {
    todoAdded(state, action) {
      const { id, createdAt, title } = action.payload;
      state.push({
        id,
        createdAt,
        title,
        completed: false,
      });
    },
    todoToggled(state, action) {
      const matchingTodo = state.find((todo) => todo.id === action.payload);
      if (matchingTodo) {
        matchingTodo.completed = !matchingTodo.completed;
      }
    },
    todoRemoved(state, action) {
      const index = state.findIndex((todo) => todo.id === action.payload);
      if (index > -1) {
        state.splice(index, 1);
      }
    },
  },
});

// `createSlice` automatically generated action creators with these names.
// export them as named exports from this "slice" file
export const { todoAdded, todoToggled, todoRemoved } = todosSlice.actions;

// Export the slice reducer as the default export
export default todosSlice.reducer;
