import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
export default function ProtectedRoute({ roles, children }) { const { user, isAuthenticated }=useAuth();const location=useLocation();if(!isAuthenticated)return <Navigate to="/login" replace state={{from:location.pathname}}/>;if(roles&&!roles.includes(user?.role))return <Navigate to="/403" replace/>;return children||<Outlet/>; }
