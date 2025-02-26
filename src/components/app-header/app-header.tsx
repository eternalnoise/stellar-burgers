import { FC, useEffect } from 'react';
import { useSelector } from '../../services/store/store';
import { AppHeaderUI } from '@ui';
import { fetchUser } from '../../services/slices/user-slice';
import { useDispatch } from '../../services/store/store';

export const AppHeader: FC = () => {
  const dispatch = useDispatch();
  const userName = useSelector((state) => state.user.user?.name);

  useEffect(() => {
    dispatch(fetchUser()); // fetchUser проверяет accessToken и записывает юзера в стейт
  }, [dispatch]);

  return <AppHeaderUI userName={userName} />;
};
