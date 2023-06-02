import { createContext } from 'react';
import { User } from '../models/user.model';

export const UserContext = createContext<User | null>(null);

export const UserContextProvider = UserContext.Provider;
