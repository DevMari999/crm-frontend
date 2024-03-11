import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { AppDispatch, RootState } from '../../store/store';
import { fetchOrders, setCurrentPage, setExpandedRow, setSortBy } from '../../slices';
import './OrdersTable.css';
import Pagination from "../Pagination/Pagination";
import { CommentInput } from "../../types";
import Loader from "../Loader/Loader";
import { OrderDetails } from '../';

const OrdersTable = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>();
    const itemsPerPage = 25;
    const orders = useSelector((state: RootState) => state.orders.data);
    const isLoading = useSelector((state: RootState) => state.orders.isLoading);
    const currentPage = useSelector((state: RootState) => state.orders.currentPage);
    const totalPages = useSelector((state: RootState) => state.orders.totalPages);
    const sortBy = useSelector((state: RootState) => state.orders.sortBy);
    const sortOrder = useSelector((state: RootState) => state.orders.sortOrder);
    const searchCriteria = useSelector((state: RootState) => state.orders.searchCriteria);
    const [commentInput, setCommentInput] = useState<CommentInput>({});
    const expandedRow = useSelector((state: RootState) => state.orders.expandedRowId);
    const [managerLastNames, setManagerLastNames] = useState<Record<string, string>>({});
    const fetchedManagerIds = useRef(new Set());



    if (navigator.userAgent.indexOf('Safari') != -1 && navigator.userAgent.indexOf('Chrome') == -1) {
        document.body.classList.add('safari-specific');
    }

    useEffect(() => {
        orders.forEach((order) => {
            const managerId = order.manager;

            if (managerId && !fetchedManagerIds.current.has(managerId)) {
                fetchedManagerIds.current.add(managerId);
                fetch(`http://localhost:8080/api/users/${managerId}`)
                    .then((response) => {
                        if (!response.ok) {
                            throw new Error('Failed to fetch');
                        }
                        return response.json();
                    })
                    .then((userData) => {
                        console.log("User Data:", userData);
                        setManagerLastNames(prev => ({
                            ...prev,
                            [managerId]: userData.lastname,
                        }));
                    })

                    .catch((error) => {
                        console.error("Failed to fetch user data:", error);
                        fetchedManagerIds.current.delete(managerId);
                    });
            }
        });
    }, [orders]);


    const updatePageInUrl = (newPage: number) => {
        navigate(`/orders?page=${newPage}`, {replace: true});
        dispatch(setCurrentPage(newPage));
    };

    const handleSort = (field: string) => {
        const newSortOrder = field === sortBy ? (sortOrder === 'asc' ? 'desc' : 'asc') : 'asc';
        dispatch(setSortBy(field));
        dispatch(fetchOrders({
            page: currentPage,
            sortBy: field,
            sortOrder: newSortOrder,
            searchCriteria
        }));
    };

    const toggleRow = (id: string) => {
        if (expandedRow === id) {
            dispatch(setExpandedRow(null));
        } else {
            dispatch(setExpandedRow(id));
        }
    };

    if (isLoading) {
        return <Loader />;
    }

    return (
        <div className="table">
            <table>
                <thead>
                <tr>
                    <th className="table-count">#</th>
                    <th onClick={() => handleSort('name')}>Name</th>
                    <th onClick={() => handleSort('surname')}>Lastname</th>
                    <th onClick={() => handleSort('email')}>Email</th>
                    <th onClick={() => handleSort('phone')}>Phone</th>
                    <th onClick={() => handleSort('age')}>Age</th>
                    <th onClick={() => handleSort('course')}>Course</th>
                    <th onClick={() => handleSort('course_format')}>Format</th>
                    <th onClick={() => handleSort('sum')}>Sum</th>
                    <th onClick={() => handleSort('already_paid')}>Paid</th>
                    <th onClick={() => handleSort('course_type')}>Type</th>
                    <th onClick={() => handleSort('created_at')}>Created at</th>
                    <th onClick={() => handleSort('group')}>Group</th>
                    <th onClick={() => handleSort('manager')}>Manager</th>
                    <th onClick={() => handleSort('status')}>Status</th>
                </tr>
                </thead>
                <tbody>
                {orders.map((order, index) => (
                    <React.Fragment key={order._id}>
                        <tr onClick={() => toggleRow(order._id)}>
                            <td className="count">{(currentPage - 1) * itemsPerPage + index + 1}</td>
                            <td>{order.name || 'N/A'}</td>
                            <td>{order.surname || 'N/A'}</td>
                            <td>{order.email || 'N/A'}</td>
                            <td>{order.phone || 'N/A'}</td>
                            <td>{order.age != null ? order.age : 'N/A'}</td>
                            <td className={order.course ? `course-${order.course}` : 'course-na'}>
                                {order.course || 'N/A'}
                            </td>
                            <td>
                                {order.course_format === 'online' ? (
                                    <div className="online-format">ONLINE</div>
                                ) : order.course_format === 'static' ? (
                                    <div className="static-format">STATIC</div>
                                ) : (
                                    'N/A'
                                )}
                            </td>
                            <td>{order.sum != null ? order.sum : 'N/A'}</td>
                            <td>
                                {order.already_paid !== null ? (order.already_paid ? 'Yes' : 'No') : 'N/A'}
                            </td>

                            <td>
                                {order.course_type === 'premium' ? (
                                    <div className="course-type premium">Premium</div>
                                ) : order.course_type === 'vip' ? (
                                    <div className="course-type vip">VIP</div>
                                ) : order.course_type === 'pro' ? (
                                    <div className="course-type pro">Pro</div>
                                ) : order.course_type === 'minimal' ? (
                                    <div className="course-type minimal">Minimal</div>
                                ) : order.course_type === 'incubator' ? (
                                    <div className="course-type incubator">Incubator</div>
                                ) : (
                                    'N/A'
                                )}
                            </td>
                            <td>{order.created_at ? new Date(order.created_at).toISOString().slice(0, -14) : 'N/A'}</td>
                            <td>{order.group || 'N/A'}</td>
                            <td>
                                {order.manager ? managerLastNames[order.manager] || 'user deleted' : 'N/A'}
                            </td>
                            <td>
                                {order.status === 'in work' ? (
                                    <div className="in-work status">in work</div>
                                ) : order.status === 'pending' ? (
                                    <div className="pending status">pending</div>
                                ) :  order.status === 'new' ? (
                                    <div className="new status">new</div>
                                ) : order.status === 'dubbing' ? (
                                    <div className="dubbing status">dubbing</div>
                                ) : order.status === 'cancelled' ? (
                                    <div className="cancelled status">cancelled</div>
                                ) : order.status === 'completed' ? (
                                    <div className="completed status">completed</div>
                                ) : (
                                    'N/A'
                                )}
                            </td>
                        </tr>
                        {expandedRow === order._id && (
                            <tr className="additional-row">
                                <td colSpan={15}>
                                    <div>
                                        {orders.map((order, index) => (
                                            <React.Fragment key={order._id}>
                                                {expandedRow === order._id && (
                                                    <OrderDetails
                                                        order={order}
                                                        commentInput={commentInput[order._id] || ''}
                                                        setCommentInput={setCommentInput}
                                                    />
                                                )}
                                            </React.Fragment>
                                        ))}

                                    </div>
                                </td>
                            </tr>
                        )}
                    </React.Fragment>
                ))}
                </tbody>
            </table>
            <Pagination currentPage={currentPage} totalPages={totalPages} updatePageInUrl={updatePageInUrl}/>

        </div>
    );
};

export default OrdersTable
