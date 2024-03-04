import React, {ReactNode} from 'react';
import {Routes, Route} from "react-router-dom";
import Login from "./components/Login/Login";
import Orders from "./components/Orders/Orders";
import Header from "./components/Header/Header";
import {store} from "./store/store";
import {Provider} from 'react-redux';
import "./App.css";
import AdminPanel from "./components/AdminPanel/AdminPanel";
import './styles/global.css';
import SetPassword from "./components/SetPassword/SetPassword";
interface LayoutProps {
    children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({children}) => {
    return (
        <div>
            <Header/>
            <div>{children}</div>
        </div>
    );
};

const App = () => {
    return (
        <div className="app">
            <Provider store={store}>
                <Routes>
                    <Route path="/activate/:token" element={<SetPassword/>} />
                    <Route path="/login" element={<Login/>}/>
                    <Route path="/orders" element={<Layout><Orders/></Layout>}/>
                    <Route path="/admin" element={<Layout><AdminPanel/></Layout>}/>
                </Routes>
            </Provider>
        </div>
    );
};

export default App;
