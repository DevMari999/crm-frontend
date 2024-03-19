import React, { useEffect, useState } from 'react';
import { Routes, Route, useNavigate, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store/store';
import { refreshAccessToken } from './slices';
import { useDispatch } from './hooks';
import { ProtectedRoute, Header, Login, Orders, AdminPanel, SetPassword } from './components';
import './App.css';
import './styles/global.css';
import NotAuthorised from "./Pages/NotAuthorised/NotAuthorised";
import MobileWarning from "./Pages/MobileWarning/MobileWarning";

interface LayoutProps {
    children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
    return (
        <div>
            <Header />
            <div>{children}</div>
        </div>
    );
};

const App = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [authInitializing, setAuthInitializing] = useState(true);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const userAgent = navigator.userAgent.toLowerCase();
        setIsMobile(/iphone|ipad|ipod|android/.test(userAgent));

        dispatch(refreshAccessToken())
            .unwrap()
            .then(() => setAuthInitializing(false))
            .catch((error) => {
                console.error(error);
                setAuthInitializing(false);
            });
    }, [dispatch]);

    if (authInitializing) {
        return <div></div>;
    }

    return (
        <Provider store={store}>
            <div className="app">
                {isMobile ? (
                  <MobileWarning/>
                ) : (
                    <Routes>
                        <Route path="/activate/:token" element={<SetPassword />} />
                        <Route path="/not-authorised" element={<NotAuthorised />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/orders" element={
                            <ProtectedRoute>
                                <Layout><Orders /></Layout>
                            </ProtectedRoute>
                        }/>
                        <Route path="/admin" element={
                            <ProtectedRoute allowedRoles={['admin']}>
                                <Layout><AdminPanel /></Layout>
                            </ProtectedRoute>
                        }/>
                    </Routes>
                )}
            </div>
        </Provider>
    );
};

export default App;
