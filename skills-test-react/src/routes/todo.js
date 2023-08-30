import React from 'react';
import TodoList from '../components/TodoList';
import { Box, Typography } from '@mui/material';
import TodoForm from '../components/TodoForm';

export default function Todo() {
  return (
    <Box sx={{ my: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        ToDo List
      </Typography>
      <TodoList />
      <TodoForm />
    </Box>
  );
}
