import React, { useState, useRef } from 'react';
import css from './TodoList.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faPen,
  faTrashCan,
  faCheck,
  faXmark,
} from '@fortawesome/free-solid-svg-icons';

export default function Todo({ id, todo, isCompleted, setIsUpdated }) {
  const token = localStorage.getItem('access_token');

  const [changeTodo, setChangeTodo] = useState(todo);
  const handleChangeTodo = e => setChangeTodo(e.target.value);

  const [isChangeTodo, setIsChangeTodo] = useState(false);
  const [isCompleteTodo, setIsCompleteTodo] = useState(isCompleted);
  const handleCompleted = () => setIsCompleteTodo(prev => !prev);
  const [isDisabled, setIsDisbled] = useState(true);

  const handleUpdate = () => {
    fetch(
      `https://5co7shqbsf.execute-api.ap-northeast-2.amazonaws.com/production/todos/${id}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          todo: changeTodo,
          isCompleted: isCompleteTodo,
        }),
      }
    ).then(res => {
      if (res.status === 200) {
        setIsUpdated(true);
        handleCancle();
      }
    });
  };

  const handleDelete = () => {
    fetch(
      `https://5co7shqbsf.execute-api.ap-northeast-2.amazonaws.com/production/todos/${id}`,
      {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    ).then(res => {
      if (res.status === 204) {
        setIsUpdated(true);
      }
    });
  };

  const todoInput = useRef(null);
  const [isReadonly, setIsReadonly] = useState(true);
  const handleEdit = () => {
    setIsReadonly(prev => !prev);
    setIsDisbled(prev => !prev);
    setIsChangeTodo(true);
    todoInput.current.focus();
  };

  const handleCancle = () => {
    setIsReadonly(prev => !prev);
    setIsDisbled(prev => !prev);
    setIsChangeTodo(false);
  };

  return (
    <li className={css.todo}>
      <div className={css.inputCheckbox}>
        <input
          type="checkbox"
          checked={isCompleteTodo}
          onChange={handleCompleted}
          disabled={isDisabled}
        />
      </div>
      <input
        className={css.todoInput}
        value={changeTodo}
        onChange={handleChangeTodo}
        readOnly={isReadonly}
        ref={todoInput}
      />

      {!isChangeTodo ? (
        <div className={css.btnWrap}>
          <button onClick={handleEdit} className={css.btnEdit}>
            <FontAwesomeIcon icon={faPen} />
          </button>
          <button onClick={handleDelete}>
            <FontAwesomeIcon icon={faTrashCan} />
          </button>
        </div>
      ) : (
        <div className={css.btnWrap}>
          <button onClick={handleUpdate} className={css.btnUpdate}>
            <FontAwesomeIcon icon={faCheck} />
          </button>
          <button onClick={handleCancle} className={css.btnCancle}>
            <FontAwesomeIcon icon={faXmark} />
          </button>
        </div>
      )}
    </li>
  );
}
