import React, { useEffect } from 'react';
import {  useSelector } from 'react-redux';
import { fetchManagers } from '../../slices/user.slice';
import { RootState } from '../../store/store';
import { useDispatch } from '../../hooks/custom.hooks';
import './Managers.css';
const Managers: React.FC = () => {
    const dispatch = useDispatch();
    const managers = useSelector((state: RootState) => state.users.managers);
    const isLoading = useSelector((state: RootState) => state.users.isLoading);

    useEffect(() => {
        dispatch(fetchManagers());
    }, [dispatch]);

    return (
        <div>
            {isLoading ? (
                <p>Loading managers...</p>
            ) : (
                <div>
                    {managers.length > 0 ? (
                        managers.map((manager) => (
                            <div className="each-manager" key={manager.email}>
                                <ul className="manager-ul">
                                    <li>Name: {manager.name}</li>
                                    <li>Last name:{manager.lastname}</li>
                                    <li>Email: {manager.email}</li>
                                    </ul>
                                <div>
                                    <button className="global-btn managers-btn">BAN</button>
                                    <button className="global-btn managers-btn">UNBAN</button>
                                    <button className="global-btn managers-btn">ACTIVATE</button>
                                    <button className="global-btn managers-btn">DELETE</button>
                                </div>


                            </div>

                        ))
                    ) : (
                        <p>No managers found.</p>
                    )}
                </div>
            )}
        </div>
    );
};

export default Managers;
