import { FC, SyntheticEvent, useState } from 'react';
import { LoginUI } from '@ui-pages';
import { useNavigate } from 'react-router-dom';
import { login } from '../../utils/auth';
import { useDispatch } from '../../services/store/store';
import { setAuthenticated, fetchUser } from '../../services/slices/user-slice';

export const Login: FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorText, setErrorText] = useState('');
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();
    setErrorText('');

    const { success, error } = await login({ email, password });
    if (success) {
      dispatch(setAuthenticated(true));
      await dispatch(fetchUser()).unwrap(); // записывает юзера в стейт
      navigate('/');
    } else {
      dispatch(setAuthenticated(false));
      setErrorText(error || 'Error logging in');
    }
  };

  return (
    <LoginUI
      errorText={errorText}
      email={email}
      setEmail={setEmail}
      password={password}
      setPassword={setPassword}
      handleSubmit={handleSubmit}
    />
  );
};
