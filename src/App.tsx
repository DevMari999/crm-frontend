import React from 'react';
import { Routes, Route } from "react-router-dom";
import Login from "./components/Login/Login";
import Orders from "./components/Orders/Orders";
import Header from "./components/Header/Header";
import AdminPanel from "./components/AdminPanel/AdminPanel";
import SetPassword from "./components/SetPassword/SetPassword";
import { ProtectedRoute } from './components/ProtectedRoute';
import { store } from "./store/store";
import { Provider } from 'react-redux';
import "./App.css";
import './styles/global.css';

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
    return (
        <div className="app">
            <Provider store={store}>
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
            </Provider>
        </div>
    );
};

export default App;
