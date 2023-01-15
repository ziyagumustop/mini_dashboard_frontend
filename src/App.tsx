
import { message } from 'antd';
import React from 'react';
import './App.css';
import { UserContext, UserContextInterface } from './context/userContext';
import HomeLayout from './pages/HomeLayout';
import LoginLayout from './pages/LoginLayout';

function App() {
  const [isLogin, setIsLogin] = React.useState<boolean>(localStorage.getItem('token') ? true : false)
  const [messageApi, contextHolder] = message.useMessage();

  const data: UserContextInterface = { isLogin, setIsLogin }

  return (
    <>
      {contextHolder}
      <UserContext.Provider value={data}>
        {isLogin ?
          <HomeLayout /> :
          <LoginLayout />
        }
      </UserContext.Provider>
    </>
  )
}

export default App
