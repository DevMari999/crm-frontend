import React, {useEffect, useState} from 'react';
import {useSelector} from 'react-redux';
import {fetchManagers} from '../../slices/user.slice';
import {RootState} from '../../store/store';
import {useDispatch} from '../../hooks/custom.hooks';
import Pagination from '../Pagination/Pagination';
import './Managers.css';

const Managers: React.FC = () => {
    const dispatch = useDispatch();
    const managers = useSelector((state: RootState) => state.users.managers);
    const isLoading = useSelector((state: RootState) => state.users.isLoading);
    const pagination = useSelector((state: RootState) => state.users.pagination);
    const [currentPage, setCurrentPage] = useState(pagination.currentPage);
    const limit = 3;

    useEffect(() => {
        console.log(`Component requesting managers for Page: ${currentPage}, Limit: ${limit}`);
        dispatch(fetchManagers({page: currentPage, limit}));
    }, [dispatch, currentPage, limit]);

    const updatePage = (newPage: number) => {
        console.log(`Updating page to: ${newPage}`);
        setCurrentPage(newPage);
    };

    return (
        <div>
            {isLoading ? (
                <p>Loading managers...</p>
            ) : (
                <>
                    <div>
                        {managers.length > 0 ? (
                            managers.map((manager) => (
                                <div className="each-manager global-block" key={manager.email}>
                                    <ul className="manager-ul">
                                        <li><b>Name:</b> {manager.name}</li>
                                        <li><b>Last name:</b>{manager.lastname}</li>
                                        <li><b>Email:</b> {manager.email}</li>
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
                    <div className="pagination-wrapper">
                        <Pagination
                            currentPage={currentPage}
                            totalPages={pagination.totalPages}
                            updatePageInUrl={updatePage}
                        />
                    </div>
                </>
            )}
        </div>
    );
};

export default Managers;
