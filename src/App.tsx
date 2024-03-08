import React, {useEffect, useState} from 'react';
import { Routes, Route } from "react-router-dom";
import Login from "./components/Login/Login";
import Orders from "./components/Orders/Orders";
import Header from "./components/Header/Header";
import AdminPanel from "./components/AdminPanel/AdminPanel";
import SetPassword from "./components/SetPassword/SetPassword";
import { ProtectedRoute } from './components/ProtectedRoute';
import { Provider } from 'react-redux';
import { store } from "./store/store";
import { refreshAccessToken } from './slices/auth.slice';
import "./App.css";
import './styles/global.css';
import {useDispatch} from "./hooks/custom.hooks";

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
    const [authInitializing, setAuthInitializing] = useState(true);
    useEffect(() => {
        dispatch(refreshAccessToken())
            .unwrap()
            .then(() => setAuthInitializing(false))
            .catch((error) => {
                console.error(error);
                setAuthInitializing(false);
            });
    }, [dispatch]);

    if (authInitializing) {
        return <div>Loading...</div>;
    }

    return (
        <Provider store={store}>
            <div className="app">
                <Routes>
                    <Route path="/activate/:token" element={<SetPassword />} />
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
            </div>
        </Provider>
    );
};

export default App;
