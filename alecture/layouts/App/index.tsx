import React from 'react';
import loadable from '@loadable/component';
import { Routes, Route, Navigate } from 'react-router-dom';

const LogIn = loadable(() => import('@pages/LogIn'));
const SignUp = loadable(() => import('@pages/SignUp'));

//import Workspace from '@layouts/Workspace';

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate replace to="/signup" />} />
      <Route path="/login" element={<LogIn />} />
      <Route path="/signup" element={<SignUp />} />
    </Routes>
  );
};

export default App;
