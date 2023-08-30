import * as React from 'react';
import Container from '@mui/material/Container';
import AccountMenu from '../AccountMenu';
import Home from '../routes/home';
import Todo from '../routes/todo';
import { Route, Routes } from 'react-router-dom';

export default function App() {
  return (
    <Container maxWidth="sm">
      <AccountMenu />
      <Routes>
        <Route path="/" element={<Home />}></Route>
        <Route path="/todo" element={<Todo />}></Route>
      </Routes>
    </Container>
  );
}
