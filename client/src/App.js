
import React from 'react';
import SignIn from './auth/SignIn';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Reports from './pages/Reports';
import Timesheet from './pages/Timesheet';
import { useSelector } from 'react-redux';
import Spinner from './component/Spinner';
import ProtectedRoute from './component/ProtectedRoute';
import PublicRoute from './component/PublicRoute';

import User from './admin/Users';
import Project from './admin/Project';
import Profile from './pages/Profile';
import ProjectDetails from './admin/ProjectDetails';
import AdminTimesheets from './admin/AdminTimesheets';
import ForgotPassword from './auth/ForgotPassword';

function App() {
  const { loading } = useSelector(state => state.alerts)

  return (
    <>
      <BrowserRouter>
        {loading ? (
          <Spinner />
        ) : (

          <Routes>
            <Route path="/admin" element={
              <ProtectedRoute>
                <AdminTimesheets />
              </ProtectedRoute>

            } />

            <Route path="/reports" element={
              <ProtectedRoute>
                <Reports />
              </ProtectedRoute>

            } />
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Timesheet />
              </ProtectedRoute>
            } />
            <Route path="/users" element={
              <ProtectedRoute>
                <User />
              </ProtectedRoute>

            } />
            <Route path="/project" element={
              <ProtectedRoute>
                <Project />
              </ProtectedRoute>

            } />

            <Route path="/profile" element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>

            } />
           
            <Route path="/project/:projectId" element={<ProjectDetails />} />

            <Route path="/" element={
              <PublicRoute>
                <SignIn />
              </PublicRoute>
            } />


            <Route path="/forgotResetPassword" element={
              <PublicRoute>
                <ForgotPassword />
              </PublicRoute>
            } />
          </Routes>


        )
        }
      </BrowserRouter>
    </>


  );
}

export default App;
