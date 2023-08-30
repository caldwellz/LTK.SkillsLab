import React from 'react';
import { Button, Grid } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { todoAdded, todoRemoved, todoToggled } from '../features/todoSlice';
import TodoItem from './TodoItem';

export default function TodoList() {
  const todos = useSelector((state) => state.todos);
  const dispatch = useDispatch();

  return (
    <Grid container>
      <Grid item xs>
        Date
      </Grid>
      <Grid item xs>
        Done?
      </Grid>
      <Grid item xs>
        Title
      </Grid>
      <Grid item xs></Grid>
      {todos.map((item, index) => {
        return <TodoItem key={index} item={item} />;
      })}
    </Grid>
  );
}
