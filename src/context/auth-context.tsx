import { createContext, useContext, useEffect, useState, type PropsWithChildren } from 'react';
import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';

const AUTH_TOKEN_KEY = 'auth_token';

type AuthContextValue = {
  token: string | null;
  isLoading: boolean;
  storageError: string;
  setAuthToken: (token: string) => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

async function readStoredToken() {
  if (Platform.OS === 'web') {
    if (typeof window === 'undefined') {
      throw new Error('Browser storage is not available');
    }
    return window.sessionStorage.getItem(AUTH_TOKEN_KEY);
  }

  return SecureStore.getItemAsync(AUTH_TOKEN_KEY);
}

async function storeToken(token: string) {
  if (Platform.OS === 'web') {
    if (typeof window === 'undefined') {
      throw new Error('Browser storage is not available');
    }
    window.sessionStorage.setItem(AUTH_TOKEN_KEY, token);
    return;
  }

  await SecureStore.setItemAsync(AUTH_TOKEN_KEY, token);
}

async function removeStoredToken() {
  if (Platform.OS === 'web') {
    if (typeof window === 'undefined') {
      throw new Error('Browser storage is not available');
    }
    window.sessionStorage.removeItem(AUTH_TOKEN_KEY);
    return;
  }

  await SecureStore.deleteItemAsync(AUTH_TOKEN_KEY);
}

export function AuthProvider({ children }: PropsWithChildren) {
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [storageError, setStorageError] = useState('');

  useEffect(() => {
    let isActive = true;

    readStoredToken()
      .then((storedToken) => {
        if (isActive) {
          setToken(storedToken);
        }
      })
      .catch(() => {
        if (isActive) {
          setStorageError('Unable to access sign-in storage. Please restart the app and try again.');
        }
      })
      .finally(() => {
        if (isActive) {
          setIsLoading(false);
        }
      });

    return () => {
      isActive = false;
    };
  }, []);

  async function setAuthToken(nextToken: string) {
    await storeToken(nextToken);
    setStorageError('');
    setToken(nextToken);
  }

  async function signOut() {
    await removeStoredToken();
    setStorageError('');
    setToken(null);
  }

  return (
    <AuthContext.Provider
      value={{ token, isLoading, storageError, setAuthToken, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}