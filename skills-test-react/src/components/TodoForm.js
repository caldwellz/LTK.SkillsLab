import React from 'react';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import { Alert, Button, FormLabel, Grid } from '@mui/material';
import { v4 as uuid } from 'uuid';
import { useDispatch, useSelector } from 'react-redux';
import { todoAdded, todoRemoved, todoToggled } from '../features/todoSlice';

export default function TodoForm() {
  const todos = useSelector((state) => state.todos);
  const dispatch = useDispatch();
  const addTodo = (item) => dispatch(todoAdded(item));

  return (
    <Formik
      initialValues={{
        title: '',
      }}
      validate={({ title }) => {
        if (!title) return { title: 'ToDo title is required.' };
      }}
      onSubmit={({ title }, { setSubmitting }) => {
        const todoItem = { id: uuid(), createdAt: Date.now(), title };
        addTodo(todoItem);
        console.log(todos);
        setSubmitting(false);
      }}>
      {({ errors, isSubmitting }) => (
        <Form>
          <ErrorMessage name="title">{(msg) => <Alert severity="error">{msg}</Alert>}</ErrorMessage>
          <Grid container>
            <Grid item xs={3} alignSelf="center">
              <FormLabel htmlFor="todoTitle">Add ToDo</FormLabel>
            </Grid>
            <Grid item xs alignSelf="center">
              <Field id="todoTitle" name="title" as="input" type="text" placeholder="ToDo..." />
            </Grid>
            <Grid item xs={2} alignSelf="center">
              <Button type="submit" disabled={isSubmitting || !!errors.title}>
                Submit
              </Button>
            </Grid>
          </Grid>
        </Form>
      )}
    </Formik>
  );
}
