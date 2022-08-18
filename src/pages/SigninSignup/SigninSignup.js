import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import css from './SigninSignup.module.scss';

export default function SigninSignup() {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (token) navigate('/todo');
  }, [navigate]);

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
    inputs.email.length > 0 && !inputs.email.includes('@')
      ? setIsValidEmail(false)
      : setIsValidEmail(true);
  };

  const [isValidPw, setIsValidPw] = useState(false);
  const pwValidation = () => {
    inputs.password.length > 0 && inputs.password.length < 8
      ? setIsValidPw(false)
      : setIsValidPw(true);
  };

  const [loginValid, setLoginValid] = useState(false);
  const loginValidation = () => {
    isValidEmail &&
    isValidPw &&
    inputs.email.length !== 0 &&
    inputs.password.length !== 0
      ? setLoginValid(true)
      : setLoginValid(false);
  };

  const handleLogin = event => {
    event.preventDefault();
    fetch(
      'https://5co7shqbsf.execute-api.ap-northeast-2.amazonaws.com/production/auth/signin',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: inputs.email,
          password: inputs.password,
        }),
      }
    )
      .then(response => response.json())
      .then(result => {
        if (result.access_token) {
          localStorage.setItem('access_token', result.access_token);
          navigate('/todo');
        } else {
          alert('이메일/비밀번호를 확인해주세요.');
        }
      });
  };

  const handleSignUp = event => {
    event.preventDefault();
    fetch(
      'https://5co7shqbsf.execute-api.ap-northeast-2.amazonaws.com/production/auth/signup',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: inputs.email,
          password: inputs.password,
        }),
      }
    )
      .then(response => response.json())
      .then(result => {
        if (result.access_token) {
          localStorage.setItem('access_token', result.access_token);
          alert('회원가입에 성공하였습니다.');
          navigate('/todo');
        } else {
          alert(`${result.message}`);
        }
      });
  };

  useEffect(() => {
    emailValidation();
    pwValidation();
    loginValidation();
  });

  return (
    <div id={css['signForm']}>
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
        <div className={css.cnt_btm}>
          <button
            disabled={!loginValid}
            className={css.btn_black}
            onClick={handleLogin}
          >
            로그인
          </button>
          <button
            disabled={!loginValid}
            className={`${css.btn_black} ${css.v2}`}
            onClick={handleSignUp}
          >
            회원가입
          </button>
        </div>
      </form>
    </div>
  );
}
