import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import {
    fetchManagers,
    generateActivationLinkForManager,
    banManager,
    unbanManager,
    deleteManager,
} from '../../slices/user.slice';
import { RootState } from '../../store/store';
import Pagination from '../Pagination/Pagination';
import './Managers.css';
import { useDispatch } from "../../hooks/custom.hooks";
import CustomModal from '../CustomModal/CustomModal';

const Managers: React.FC = () => {
    const dispatch = useDispatch();
    const managers = useSelector((state: RootState) => state.users.managers);
    const isLoading = useSelector((state: RootState) => state.users.isLoading);
    const pagination = useSelector((state: RootState) => state.users.pagination);
    const [currentPage, setCurrentPage] = useState(pagination.currentPage);
    const limit = 3;
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [action, setAction] = useState('');
    const [userIdToDelete, setUserIdToDelete] = useState('');

    useEffect(() => {
        dispatch(fetchManagers({ page: currentPage, limit }));
    }, [dispatch, currentPage, limit]);

    const updatePage = (newPage: number) => {
        setCurrentPage(newPage);
    };
    useEffect(() => {
        const body = document.querySelector('body');
        if (isModalOpen) {
            body?.classList.add('modal-open');
        } else {
            body?.classList.remove('modal-open');
        }
    }, [isModalOpen]);
    const handleOpenModal = (action: string, userId?: string) => {
        setAction(action);
        if (userId) setUserIdToDelete(userId);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    const handleConfirmAction = () => {
        handleCloseModal();
        switch (action) {
            case 'ban':
                dispatch(banManager(userIdToDelete))
                    .unwrap()
                    .then(() => {
                        dispatch(fetchManagers({ page: currentPage, limit }));
                    })
                    .catch(() => {
                        alert('Failed to ban manager.');
                    });
                break;
            case 'unban':
                dispatch(unbanManager(userIdToDelete))
                    .unwrap()
                    .then(() => {
                        dispatch(fetchManagers({ page: currentPage, limit }));
                    })
                    .catch(() => {
                        alert('Failed to unban manager.');
                    });
                break;
            case 'delete':
                dispatch(deleteManager(userIdToDelete))
                    .unwrap()
                    .then(() => {

                        const isLastManagerOnPage = managers.length === 1;
                        let newCurrentPage = currentPage;
                        if (isLastManagerOnPage && currentPage > 1) {
                            newCurrentPage = currentPage - 1;
                        }
                        setCurrentPage(newCurrentPage);
                        dispatch(fetchManagers({ page: newCurrentPage, limit }));
                    })
                    .catch(() => {
                        alert('Failed to delete manager.');
                    });
                break;
            default:
                break;
        }
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
                                            <button className="global-btn managers-btn"
                                                    onClick={() => handleOpenModal('unban', manager._id)}>UNBAN</button>
                                        ) : (
                                            <button className="global-btn managers-btn"
                                                    onClick={() => handleOpenModal('ban', manager._id)}>BAN</button>
                                        )}

                                        <button
                                            className="global-btn managers-btn"
                                            onClick={() => handleActivateManager(manager._id)}
                                        >
                                            {manager.password ? 'RESET PASSWORD' : 'ACTIVATE'}
                                        </button>

                                        <button className="global-btn managers-btn delete-managers"
                                                onClick={() => handleOpenModal('delete', manager._id)}>DELETE
                                        </button>
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
                    {isModalOpen && (
                        <CustomModal
                            message={`Are you sure you want to ${action} this manager?`}
                            onConfirm={handleConfirmAction}
                            onCancel={handleCloseModal}
                        />
                    )}
                </>
            )}
        </div>
    );
};

export default Managers;
