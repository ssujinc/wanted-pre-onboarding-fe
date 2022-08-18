import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import css from './TodoList.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import Todo from './Todo.js';

export default function TodoList() {
  const navigate = useNavigate();
  const token = localStorage.getItem('access_token');
  useEffect(() => {
    if (!token) navigate('/');
  }, [navigate, token]);

  const [todoInput, setTodoInput] = useState('');
  const [isUpdated, setIsUpdated] = useState(false);

  const handleChangeTodo = e => setTodoInput(e.target.value);

  const handleCreateTodo = e => {
    e.preventDefault();
    fetch(
      `https://5co7shqbsf.execute-api.ap-northeast-2.amazonaws.com/production/todos`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ todo: todoInput }),
      }
    ).then(response => {
      if (response.status === 201) {
        setIsUpdated(true);
        setTodoInput('');
      }
    });
  };

  const [todoList, setTodoList] = useState([]);
  useEffect(() => {
    setIsUpdated(false);
    fetch(
      'https://5co7shqbsf.execute-api.ap-northeast-2.amazonaws.com/production/todos',
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      }
    )
      .then(res => {
        if (res.status === 200) return res.json();
      })
      .then(res => {
        setTodoList(res);
      });
  }, []);

  return (
    <div className={css.todoListWrap}>
      <div className={css.cont}>
        <h1>Todo LIST</h1>
        <div className={css.listWrap}>
          <div className={css.inputWrap}>
            <input
              type="text"
              value={todoInput}
              placeholder="Todo를 입력해주세요."
              onChange={handleChangeTodo}
            />
            <button onClick={handleCreateTodo}>
              <FontAwesomeIcon icon={faPlus} />
            </button>
          </div>
          <ul className={css.todoWrap}>
            {todoList.map(todo => {
              return (
                <Todo
                  key={todo.id}
                  id={todo.id}
                  todo={todo.todo}
                  isCompleted={todo.isCompleted}
                  setIsUpdated={setIsUpdated}
                />
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
}
