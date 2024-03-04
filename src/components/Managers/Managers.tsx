import React, { useEffect, useState } from 'react';
import { useSelector} from 'react-redux';
import {
    fetchManagers,
    generateActivationLinkForManager,
    banManager,
    unbanManager,
    deleteManager, // Make sure these are imported from your slice
} from '../../slices/user.slice';
import { RootState } from '../../store/store';
import Pagination from '../Pagination/Pagination';
import './Managers.css';
import {useDispatch} from "../../hooks/custom.hooks";

const Managers: React.FC = () => {
    const dispatch = useDispatch();
    const managers = useSelector((state: RootState) => state.users.managers);
    const isLoading = useSelector((state: RootState) => state.users.isLoading);
    const pagination = useSelector((state: RootState) => state.users.pagination);
    const [currentPage, setCurrentPage] = useState(pagination.currentPage);
    const limit = 3;

    useEffect(() => {
        dispatch(fetchManagers({ page: currentPage, limit }));
    }, [dispatch, currentPage, limit]);

    const updatePage = (newPage: number) => {
        setCurrentPage(newPage);
    };

    const handleActivateManager = (userId: string) => {
        dispatch(generateActivationLinkForManager(userId))
            .unwrap()
            .then(() => {
                alert('Activation link generated successfully.');
            })
            .catch((error: unknown) => {
                let errorMessage = 'Failed to perform action.';
                if (error instanceof Error) {
                    errorMessage = error.message;
                }
                console.error('Error:', errorMessage);
                alert(errorMessage);
            });
    };

    const handleBanUnbanManager = (userId: string, shouldBan: boolean) => {
        if (shouldBan) {
            dispatch(banManager(userId))
                .unwrap()
                .then(() => {
                    alert('Manager banned successfully.');
                    dispatch(fetchManagers({ page: currentPage, limit })); // Refresh the list
                })
                .catch((error: unknown) => {
                    alert('Failed to ban manager.');
                });
        } else {
            dispatch(unbanManager(userId))
                .unwrap()
                .then(() => {
                    alert('Manager unbanned successfully.');
                    dispatch(fetchManagers({ page: currentPage, limit })); // Refresh the list
                })
                .catch((error: unknown) => {
                    alert('Failed to unban manager.');
                });
        }
    };

    const handleDeleteManager = (userId: string) => {
        dispatch(deleteManager(userId))
            .unwrap()
            .then(() => {
                alert('Manager deleted successfully.');
                dispatch(fetchManagers({ page: currentPage, limit })); // Refresh the list
            })
            .catch((error: unknown) => {
                alert('Failed to delete manager.');
            });
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
                                        {manager.banned ? (
                                            <button className="global-btn managers-btn" onClick={() => handleBanUnbanManager(manager._id, false)}>UNBAN</button>
                                        ) : (
                                            <button className="global-btn managers-btn" onClick={() => handleBanUnbanManager(manager._id, true)}>BAN</button>
                                        )}

                                        <button
                                            className="global-btn managers-btn"
                                            onClick={() => handleActivateManager(manager._id)}
                                        >
                                            {manager.password ? 'RESET PASSWORD' : 'ACTIVATE'}
                                        </button>

                                        <button className="global-btn managers-btn" onClick={() => handleDeleteManager(manager._id)}>DELETE</button>
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
