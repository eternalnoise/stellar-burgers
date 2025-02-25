import {
  getUserApi,
  logoutApi,
  updateUserApi
} from '../../../utils/burger-api';
import {
  fetchUser,
  updateUser,
  logoutUser,
  setAuthenticated
} from '../user-slice';
import reducer from '../user-slice';
import store from '../../store/store';
import { TUser } from '../../../utils/types';
import { jest } from '@jest/globals';
import * as burgerApi from '../../../utils/burger-api';

const mockUser = {
  email: 'test@test.com',
  name: 'Test User'
} as TUser;

describe('user slice', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should check initial state', () => {
    const initialState = reducer(undefined, { type: 'UNKNOWN_ACTION' });
    expect(initialState.user).toBeNull();
    expect(initialState.loading).toBe(false);
    expect(initialState.error).toBeNull();
    expect(initialState.isAuthenticated).toBe(false);
  });

  it('should handle failed user fetch', async () => {
    const errorMessage = 'Failed to fetch user';
    const getUserMockFail = jest
      .spyOn(burgerApi, 'getUserApi')
      .mockImplementation(() => Promise.reject(new Error(errorMessage)));

    await store.dispatch(fetchUser());

    expect(store.getState().user.loading).toBe(false);
    expect(store.getState().user.error).not.toBeNull();
    expect(store.getState().user.user).toBeNull();
    expect(store.getState().user.isAuthenticated).toBe(false);
    expect(getUserMockFail).toHaveBeenCalled();
  });

  it('should handle pending user fetch state', async () => {
    const getUserMock = jest
      .spyOn(burgerApi, 'getUserApi')
      .mockImplementation(() =>
        Promise.resolve({ user: mockUser, success: true })
      );

    store.dispatch(fetchUser());

    expect(store.getState().user.loading).toBe(true);
    expect(store.getState().user.error).toBe(null);
    expect(getUserMock).toHaveBeenCalled();
  });

  it('should handle successful user fetch', async () => {
    const getUserMock = jest
      .spyOn(burgerApi, 'getUserApi')
      .mockImplementation(() =>
        Promise.resolve({ user: mockUser, success: true })
      );

    await store.dispatch(fetchUser());

    expect(store.getState().user.loading).toBe(false);
    expect(store.getState().user.error).toBe(null);
    expect(store.getState().user.user).toEqual(mockUser);
    expect(store.getState().user.isAuthenticated).toBe(true);
    expect(getUserMock).toHaveBeenCalled();
  });

  it('should handle successful user update', async () => {
    const updatedUser = { ...mockUser, name: 'Updated Name' };
    const updateUserMock = jest
      .spyOn(burgerApi, 'updateUserApi')
      .mockImplementation(() =>
        Promise.resolve({ user: updatedUser, success: true })
      );

    await store.dispatch(updateUser({ name: 'Updated Name' }));

    expect(store.getState().user.loading).toBe(false);
    expect(store.getState().user.error).toBe(null);
    expect(store.getState().user.user).toEqual(updatedUser);
    expect(updateUserMock).toHaveBeenCalled();
  });

  it('should handle failed user update', async () => {
    const errorMessage = 'Failed to update user';
    const updateUserMockFail = jest
      .spyOn(burgerApi, 'updateUserApi')
      .mockImplementation(() => Promise.reject(new Error(errorMessage)));

    await store.dispatch(updateUser({ name: 'Updated Name' }));

    expect(store.getState().user.loading).toBe(false);
    expect(store.getState().user.error).not.toBeNull();
    expect(updateUserMockFail).toHaveBeenCalled();
  });

  it('should handle successful logout', async () => {
    const getUserMock = jest
      .spyOn(burgerApi, 'getUserApi')
      .mockImplementation(() =>
        Promise.resolve({ user: mockUser, success: true })
      );
    await store.dispatch(fetchUser());

    const logoutMock = jest
      .spyOn(burgerApi, 'logoutApi')
      .mockImplementation(() => Promise.resolve({ success: true }));

    await store.dispatch(logoutUser());

    expect(logoutMock).toHaveBeenCalled();
    expect(store.getState().user.user).toBeNull();
    expect(store.getState().user.isAuthenticated).toBe(false);
    expect(store.getState().user.loading).toBe(false);
    expect(store.getState().user.error).toBeNull();
  });

  it('should handle failed logout', async () => {
    const errorMessage = 'Failed to logout';
    const logoutMockFail = jest
      .spyOn(burgerApi, 'logoutApi')
      .mockImplementation(() => Promise.reject(new Error(errorMessage)));

    await store.dispatch(logoutUser());

    expect(logoutMockFail).toHaveBeenCalled();
    expect(store.getState().user.loading).toBe(false);
    expect(store.getState().user.error).not.toBeNull();
  });

  it('should handle pending logout state', async () => {
    const logoutMock = jest
      .spyOn(burgerApi, 'logoutApi')
      .mockImplementation(
        () => new Promise((resolve) => setTimeout(resolve, 100))
      );

    store.dispatch(logoutUser());

    expect(store.getState().user.loading).toBe(true);
    expect(store.getState().user.error).toBe(null);
    expect(logoutMock).toHaveBeenCalled();
  });

  it('should handle authentication state change', () => {
    store.dispatch(setAuthenticated(true));
    expect(store.getState().user.isAuthenticated).toBe(true);

    store.dispatch(setAuthenticated(false));
    expect(store.getState().user.isAuthenticated).toBe(false);
  });
});
