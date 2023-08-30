import React from 'react';
import { Grid } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
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
      <Grid item xs={6}>
        Title
      </Grid>
      <Grid item xs>
        Remove
      </Grid>
      {todos.map((item, index) => {
        return <TodoItem key={index} item={item} />;
      })}
    </Grid>
  );
}
