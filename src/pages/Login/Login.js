import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import css from './Login.module.scss';

function Login() {
  const navigate = useNavigate();
  const [inputs, setInputs] = useState({
    email: '',
    password: '',
  });

  const handleInputsByName = e => {
    setInputs({
      ...inputs,
      [e.target.name]: e.target.value,
    });
  };

  const [isValidEmail, setIsValidEmail] = useState(false);
  const emailValidation = () => {
    if (inputs.email.length === 0) setIsValidEmail(true);
    else if (inputs.email.includes('@')) {
      setIsValidEmail(true);
    } else {
      setIsValidEmail(false);
    }
  };

  const [isValidPw, setIsValidPw] = useState(false);
  const pwValidation = () => {
    if (inputs.password.length === 0) setIsValidPw(true);
    else if (inputs.password.length > 7) {
      setIsValidPw(true);
    } else {
      setIsValidPw(false);
    }
  };

  const [loginValid, setLoginValid] = useState(false);
  const loginValidaion = () => {
    if (
      isValidEmail &&
      isValidPw &&
      inputs.email.length !== 0 &&
      inputs.password.length !== 0
    ) {
      setLoginValid(true);
    } else {
      setLoginValid(false);
    }
  };

  useEffect(() => {
    emailValidation();
    pwValidation();
    loginValidaion();
  });

  const handleLogin = event => {
    event.preventDefault();
    fetch(
      `https://5co7shqbsf.execute-api.ap-northeast-2.amazonaws.com/production/auth/signin`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: inputs.email,
          password: inputs.password,
        }),
      }
    )
      .then(response => {
        if (response.status === 201) {
          navigate('/');
        } else {
          alert('로그인/비밀번호를 확인해주세요');
        }
        return response.json();
      })
      .then(result => {
        // localStorage.getItem("token");

        if (result.message.includes('SUCCESS')) {
          localStorage.setItem('token', result.token);
        } else {
          localStorage.setItem('token', '');
        }
      });
  };

  return (
    <div id={css['login']}>
      <form className={css.cont}>
        <div className={css.cnt_div}>
          <label htmlFor="email">이메일</label>
          <input
            id="email"
            name="email"
            type="text"
            placeholder="이메일"
            autoComplete="off"
            onChange={handleInputsByName}
          />
          {!isValidEmail && (
            <span className={css.alert_txt}>
              이메일 주소를 정확히 입력해주세요.
            </span>
          )}
        </div>
        <div className={css.cnt_div}>
          <label htmlFor="password">비밀번호</label>
          <input
            id="password"
            name="password"
            type="password"
            placeholder="비밀번호"
            autoComplete="off"
            onChange={handleInputsByName}
          />
          {!isValidPw && (
            <span className={css.alert_txt}>8글자 이상 입력해주시요.</span>
          )}
        </div>

        <button
          disabled={!loginValid}
          className={css.btn_black}
          onClick={handleLogin}
        >
          LOGIN
        </button>
        <Link to="/signup" className={css.btn_goLink}>
          회원가입 하기
        </Link>
      </form>
    </div>
  );
}

export default Login;
