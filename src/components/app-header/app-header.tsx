import { FC, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { AppHeaderUI } from '@ui';
import { fetchUser } from '../../services/slices/user-slice';
import { useDispatch } from '../../services/store/store';
import { selectUserName } from '../../services/selectors/user';
import { UserState } from '../../utils/types';

export const AppHeader: FC = () => {
  const dispatch = useDispatch();
  const userName = useSelector(selectUserName);

  useEffect(() => {
    dispatch(fetchUser()); // fetchUser проверяет accessToken и записывает юзера в стейт
  }, [dispatch]);

  return <AppHeaderUI userName={userName} />;
};
