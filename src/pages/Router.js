import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import SigninSignup from './SigninSignup/SigninSignup';
import TodoList from './TodoList/TodoList';

function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<SigninSignup />} />
        <Route path="/todo" element={<TodoList />} />
      </Routes>
    </BrowserRouter>
  );
}

export default Router;
