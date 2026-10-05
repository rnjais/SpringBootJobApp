import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';
import ErrorBoundary from './components/ErrorBoundary';
import ProtectedRoute from './components/ProtectedRoute';
import { queryClient } from './lib/queryClient';
import { AuthLayout, DashboardLayout, MainLayout } from './layouts/MainLayout';
import ApplicationTrackerPage from './pages/ApplicationTrackerPage';
import AuthPage from './pages/AuthPage';
import HomePage from './pages/HomePage';
import JobDetailPage from './pages/JobDetailPage';
import JobsPage from './pages/JobsPage';
import RecruiterDashboardPage from './pages/RecruiterDashboardPage';
import ProfilePage from './pages/ProfilePage';
import { ForbiddenPage, NotFoundPage, RouteErrorPage } from './pages/SystemPages';

const router = createBrowserRouter([
  { element: <MainLayout/>, errorElement: <RouteErrorPage/>, children: [
    { path:'/', element:<HomePage/> }, { path:'/jobs', element:<JobsPage/> }, { path:'/jobs/:id', element:<JobDetailPage/> },
    { path:'/403', element:<ForbiddenPage/> }, { path:'*', element:<NotFoundPage/> },
  ]},
  { element:<AuthLayout/>, children:[{path:'/login',element:<AuthPage/>},{path:'/register',element:<AuthPage mode="register"/>}] },
  { element:<ProtectedRoute roles={['JOB_SEEKER','RECRUITER','ADMIN']}/>, children:[{element:<DashboardLayout/>,children:[{path:'/dashboard/profile',element:<ProfilePage/>}]}] },
  { element:<ProtectedRoute roles={['JOB_SEEKER']}/>, children:[{element:<DashboardLayout/>,children:[{path:'/dashboard',element:<ApplicationTrackerPage/>}]}] },
  { element:<ProtectedRoute roles={['RECRUITER','ADMIN']}/>, children:[{element:<DashboardLayout/>,children:[{path:'/recruiter',element:<RecruiterDashboardPage/>}]}] },
]);

export default function App() { return <QueryClientProvider client={queryClient}><ErrorBoundary><RouterProvider router={router}/></ErrorBoundary><Toaster position="top-right" richColors closeButton/></QueryClientProvider>; }
