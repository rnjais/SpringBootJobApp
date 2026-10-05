import { createContext, useContext, useEffect, useState } from 'react'; import api from '../services/apiClient';
const AuthContext = createContext(null);
export function AuthProvider({ children }) { const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('user') || 'null')); const [token, setToken] = useState(() => localStorage.getItem('token')); const [theme,setTheme]=useState(()=>localStorage.getItem('theme')||'light');
 const accept = data => { localStorage.setItem('token', data.token); localStorage.setItem('user', JSON.stringify(data.user)); setToken(data.token); setUser(data.user); };
 const login = async credentials => accept((await api.post('/auth/login', credentials)).data);
 const register = async details => accept((await api.post('/auth/register', details)).data);
 const logout = () => { localStorage.removeItem('token'); localStorage.removeItem('user'); setUser(null); setToken(null); };
 const updateUser = profile => {const next={...user,...profile};localStorage.setItem('user',JSON.stringify(next));setUser(next);};
 useEffect(() => { const expire = () => logout(); window.addEventListener('auth:expired', expire); return () => window.removeEventListener('auth:expired', expire); }, []);
 const toggleTheme=()=>setTheme(current=>{const next=current==='light'?'dark':'light';localStorage.setItem('theme',next);document.documentElement.dataset.theme=next;return next;});
 useEffect(()=>{document.documentElement.dataset.theme=theme;},[theme]);
 return <AuthContext.Provider value={{ user, token, login, register, logout, updateUser, theme, toggleTheme, isAuthenticated: !!token }}>{children}</AuthContext.Provider>; }
export const useAuth = () => useContext(AuthContext);
