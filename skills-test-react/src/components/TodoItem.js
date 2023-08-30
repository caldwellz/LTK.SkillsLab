import React from 'react';
import { Button, Checkbox, Grid } from '@mui/material';
import { useDispatch } from 'react-redux';
import { todoRemoved, todoToggled } from '../features/todoSlice';

export default function TodoItem({ item }) {
  const { id, createdAt, title, completed } = item;
  const dispatch = useDispatch();
  const toggleThisTodo = () => dispatch(todoToggled(id));
  const removeThisTodo = () => dispatch(todoRemoved(id));

  return (
    <Grid container>
      <Grid item xs alignSelf="center">
        {new Date(createdAt).toLocaleDateString()}
      </Grid>
      <Grid item xs alignSelf="center">
        <Checkbox checked={completed} onChange={toggleThisTodo} />
      </Grid>
      <Grid item xs={6} alignSelf="center">
        {title}
      </Grid>
      <Grid item xs alignSelf="center">
        <Button onClick={removeThisTodo}>&times;</Button>
      </Grid>
    </Grid>
  );
}
