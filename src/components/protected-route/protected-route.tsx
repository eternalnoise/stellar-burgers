import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { FC, ReactElement } from 'react';

type ProtectedRouteProps = {
  children: ReactElement;
};

export const ProtectedRoute: FC<ProtectedRouteProps> = ({ children }) => {
  const isAuthenticated = useSelector(
    (state: any) => state.user.isAuthenticated
  );

  if (!isAuthenticated) {
    return <Navigate to='/login' replace />;
  }

  return children;
};
