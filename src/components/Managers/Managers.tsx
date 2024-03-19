import React, {useEffect, useState} from 'react';
import {useSelector} from 'react-redux';
import {
    fetchManagers,
    generateActivationLinkForManager,
    banManager,
    unbanManager,
    deleteManager,
    fetchOrderStatsByManager
} from '../../slices';
import {RootState} from '../../store/store';
import {Pagination, CustomModal } from '../';
import './Managers.css';
import {useDispatch} from "../../hooks";
import {restoreScrollPosition} from "../../utils/scrollPositionUtils";
import {useNavigate} from "react-router-dom";


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
    const [activationLinks, setActivationLinks] = useState<{ [key: string]: { link: string | null; visible: boolean } }>({});
    const orderStatsByManager = useSelector((state: RootState) => state.orders.orderStatsByManager);
    const navigate = useNavigate();
    const [scrollPosition, setScrollPosition] = useState(0);
    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const page = parseInt(urlParams.get('page') || '1', 10);
        dispatch(fetchManagers({page: currentPage, limit}));
        dispatch(fetchOrderStatsByManager());
    }, [dispatch, currentPage, limit]);

    const updatePage = (newPage: number) => {
        setCurrentPage(newPage);
        dispatch(fetchManagers({page: newPage, limit}));
        navigate(`/admin?page=${newPage}`, { replace: true });
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
        const performAction = async () => {
            try {
                switch (action) {
                    case 'ban':
                        await dispatch(banManager(userIdToDelete)).unwrap();
                        break;
                    case 'unban':
                        await dispatch(unbanManager(userIdToDelete)).unwrap();
                        break;
                    case 'delete':
                        await dispatch(deleteManager(userIdToDelete)).unwrap();
                        const updatedManagers = managers.filter(manager => manager._id !== userIdToDelete);
                        if (managers.length === 1 && currentPage > 1) {
                            setCurrentPage(currentPage - 1);
                        } else {
                        }
                        break;
                    default:
                        break;
                }
            } catch (error) {
                alert(`Failed to ${action} manager.`);
            }
        };
        performAction();
    };
    useEffect(() => {
        if (scrollPosition !== 0) {
            restoreScrollPosition(scrollPosition);
            setScrollPosition(0);
        }
    }, [activationLinks]);

    const handleActivateManager = (userId: string) => {
        const currentScrollPosition = window.scrollY;
        setScrollPosition(currentScrollPosition);
        dispatch(generateActivationLinkForManager(userId))
            .unwrap()
            .then((response) => {
                const link = response.activationLink;
                setActivationLinks(prev => ({
                    ...prev,
                    [userId]: { link, visible: true }
                }));

                setTimeout(() => {
                    setActivationLinks(prev => ({
                        ...prev,
                        [userId]: { ...prev[userId], visible: false }
                    }));
                }, 3600000);
            })
            .catch((error) => {
                console.error('Error generating activation link:', error);
                alert('Failed to generate activation link.');
            });

    };


    const copyToClipboard = (userId: string) => {
        const link = activationLinks[userId]?.link;
        if (link) {
            navigator.clipboard.writeText(link).then(() => {
                alert('Activation link copied to clipboard');
                setActivationLinks(prev => ({...prev, [userId]: {link: null, visible: false}}));
            }).catch((err) => {
                console.error('Could not copy text: ', err);
            });
        }
    };


    return (
        <div>
            {isLoading ? (
                <p>Loading managers...</p>
            ) : (
                <>
                    <div>
                        {managers.length > 0 ? (
                            managers.map((manager) => {
                                const managerStats = orderStatsByManager.find(stat => stat.manager === manager._id);
                                return (
                                    <div className="each-manager global-block" key={manager.email}>
                                        <ul className="manager-ul">
                                            <li><b>Name:</b> {manager.name}</li>
                                            <li><b>Last name:</b> {manager.lastname}</li>
                                            <li><b>Email:</b> {manager.email}</li>
                                            <li><b>Active:</b> {manager.isActive.toString()}</li>
                                            <li><b>Last
                                                login:</b> {manager.last_login ? new Date(manager.last_login).toLocaleString() : 'Not available'}
                                            </li>
                                        </ul>
                                        {managerStats ? (
                                            <div className="orders-manager">
                                                <table className="manager-table">
                                                    <tbody >
                                                    <tr key="total">
                                                        <td className="manager-table-td"><b>Total orders:</b></td>
                                                        <td> {managerStats.totalOrders}</td>
                                                    </tr>
                                                    {managerStats.statuses.map((status) => (
                                                        <tr key={status.status}>
                                                            <td className="manager-table-td">{status.status || "new"}:</td>
                                                            <td>{status.count}</td>
                                                        </tr>
                                                    ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        ) : (

                                            <div className="orders-manager">No orders.</div>
                                        )}
                                        <div className="manager-all-btn">
                                            {manager.banned ? (
                                                <button className="global-btn managers-btn"
                                                        onClick={() => handleOpenModal('unban', manager._id)}>UNBAN</button>
                                            ) : (
                                                <button className="global-btn managers-btn"
                                                        onClick={() => handleOpenModal('ban', manager._id)}>BAN</button>
                                            )}

                                            {activationLinks[manager._id]?.visible ? (
                                                <button
                                                    className="global-btn managers-btn"
                                                    onClick={() => copyToClipboard(manager._id)}
                                                >
                                                    COPY TO CLIPBOARD
                                                </button>
                                            ) : (
                                                <button
                                                    className="global-btn managers-btn"
                                                    onClick={() => handleActivateManager(manager._id)}
                                                >
                                                    {manager.password ? 'RESET PASSWORD' : 'ACTIVATE'}
                                                </button>
                                            )}

                                            <button className="global-btn managers-btn delete-managers"
                                                    onClick={() => handleOpenModal('delete', manager._id)}>DELETE
                                            </button>
                                        </div>
                                    </div>
                                );
                            })
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
