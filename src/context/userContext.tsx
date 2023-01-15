import { useState, createContext } from "react";
import React from 'react';
import ReactDOM from "react-dom/client";

export interface UserContextInterface {
    isLogin: boolean;
    setIsLogin: React.Dispatch<React.SetStateAction<boolean>>;

}

export const UserContext = createContext<UserContextInterface>({ isLogin: false, setIsLogin: () => { } })