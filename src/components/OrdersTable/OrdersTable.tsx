import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux'
import {useNavigate, useLocation} from 'react-router-dom';
import {AppDispatch, RootState} from '../../store/store';
import {fetchOrders, setCurrentPage, setSortBy} from '../../slices/orders.slice';
import './OrdersTable.css';
import {Order} from "../../types/order.types";
import EditOrder from "../EditOrder/EditOrder";
const OrdersTable = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch<AppDispatch>();
    const itemsPerPage = 25;
    const [expandedRow, setExpandedRow] = useState<string | null>(null);

    const orders = useSelector((state: RootState) => state.orders.data);
    const isLoading = useSelector((state: RootState) => state.orders.isLoading);
    const currentPage = useSelector((state: RootState) => state.orders.currentPage);
    const totalPages = useSelector((state: RootState) => state.orders.totalPages);
    const sortBy = useSelector((state: RootState) => state.orders.sortBy);
    const sortOrder = useSelector((state: RootState) => state.orders.sortOrder);
    const searchCriteria = useSelector((state: RootState) => state.orders.searchCriteria);
    const [editingOrderId, setEditingOrderId] = useState<string | null>(null);
    const [commentInput, setCommentInput] = useState<CommentInput>({});
    const [tempComments, setTempComments] = useState<TempComments>({});

    interface CommentInput {
        [orderId: string]: string;
    }

    interface TempComments {
        [orderId: string]: string[];
    }

    const renderPagination = () => {
        let pages = [];
        const range = 5;
        const delta = Math.floor(range / 2);
        let start = Math.max(currentPage - delta, 1);
        let end = Math.min(start + range - 1, totalPages);

        if (totalPages - currentPage < delta) {
            start = Math.max(totalPages - range + 1, 1);
        }

        pages.push(
            <button key="prev" onClick={() => handlePreviousPage()} disabled={currentPage === 1}>
                {"<"}
            </button>
        );

        for (let i = start; i <= end; i++) {
            pages.push(
                <button
                    key={i}
                    className={`page-button ${currentPage === i ? "active-button" : ""}`}
                    onClick={() => updatePageInUrl(i)}
                >
                    {i}
                </button>
            );
        }

        if (end < totalPages) {
            pages.push(<span key="ellipsis">...</span>);
            pages.push(
                <button key={totalPages} onClick={() => updatePageInUrl(totalPages)}>
                    {totalPages}
                </button>
            );
        }

        pages.push(
            <button key="next" onClick={() => handleNextPage()} disabled={currentPage >= totalPages}>
                {">"}
            </button>
        );

        return pages;
    };

    const handleEditClick = (orderId: string) => {
        setEditingOrderId(orderId);
    };

    const handleSaveEdit = async (orderId: string, updatedOrderData: Partial<Order>) => {
        try {
            const response = await fetch(`http://localhost:8080/api/orders/${orderId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedOrderData),
            });

            if (!response.ok) {
                throw new Error('Failed to update the order.');
            }

            const updatedOrder = await response.json();
            console.log('Order updated successfully:', updatedOrder);

            dispatch(fetchOrders({
                page: currentPage,
                sortBy,
                sortOrder,
                searchCriteria,
            }));

            setEditingOrderId(null);
        } catch (error) {
            console.error('Error updating order:', error);
        }
    };

    const handleAddComment = async (orderId: string) => {
        const comment = commentInput[orderId];
        if (!comment) return;

        try {
            const response = await fetch(`http://localhost:8080/api/orders/${orderId}/comments`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ comment: comment, managerId: "managerId" }),
            });

            if (!response.ok) {
                throw new Error('Failed to add the comment.');
            }

            const updatedOrder = await response.json();
            console.log('Comment added successfully:', updatedOrder);

            const newComments = tempComments[orderId] ? [...tempComments[orderId], comment] : [comment];
            setTempComments({ ...tempComments, [orderId]: newComments });

            setCommentInput({ ...commentInput, [orderId]: '' });
        } catch (error) {
            console.error('Error adding comment:', error);
        }
    };


    const handleCancelEdit = () => {
        setEditingOrderId(null);
    };
    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const pageFromUrl = parseInt(queryParams.get('page') || '1');
        dispatch(setCurrentPage(pageFromUrl));
        dispatch(fetchOrders({
            page: pageFromUrl,
            sortBy,
            sortOrder,
            searchCriteria
        }));
    }, [dispatch, location.search, sortBy, sortOrder, searchCriteria]);

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


    const handleNextPage = () => {
        if (currentPage < totalPages) {
            updatePageInUrl(currentPage + 1);
        }
    };

    const handlePreviousPage = () => {
        if (currentPage > 1) {
            updatePageInUrl(currentPage - 1);
        }
    };

    const toggleRow = (id: string) => {
        setExpandedRow(expandedRow === id ? null : id);
    };

    if (isLoading) {
        return <p>Loading orders...</p>;
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
                            <td>{order.course || 'N/A'}</td>
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
                            <td>{order.already_paid != null ? order.already_paid.toString() : 'N/A'}</td>
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
                            <td>{order.manager || 'N/A'}</td>
                            <td>{order.status || 'N/A'}</td>
                        </tr>
                        {expandedRow === order._id && (
                            <tr className="additional-row">
                                <td colSpan={15}>
                                    <div className="additional">
                                        <div>
                                            <div>message: {order.msg || 'N/A'}</div>
                                            <div>utm: {order.utm || 'N/A'}</div>
                                        </div>

                                        <div>
                                            {orders.map((order, index) => (
                                                <React.Fragment key={order._id}>
                                                    <tr onClick={() => toggleRow(order._id)}>
                                                    </tr>
                                                    {expandedRow === order._id && (
                                                        <tr className="additional-row">
                                                            <td colSpan={15}>
                                                                <div className="additional">
                                                                    <div className="comments-section">
                                                                        {order.comments && order.comments.map((comment, commentIndex) => (
                                                                            <div key={`persisted-${commentIndex}`} className="comment">
                                                                                <p>{comment.comment}</p>
                                                                                <p>Manager ID: {comment.managerId}</p>
                                                                                <p>Time: {new Date(comment.createdAt).toLocaleString()}</p>
                                                                            </div>
                                                                        ))}

                                                                        {tempComments[order._id] && tempComments[order._id].map((tempComment, tempIndex) => (
                                                                            <div key={`temp-${tempIndex}`} className="comment">
                                                                                <p>{tempComment}</p>
                                                                            </div>
                                                                        ))}
                                                                    </div>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    )}
                                                </React.Fragment>
                                            ))}


                                            <input
                                                className="add-comment"
                                                type="text"
                                                placeholder="Add a comment"
                                                value={commentInput[order._id] || ''}
                                                onChange={(e) => setCommentInput({ ...commentInput, [order._id]: e.target.value })}
                                            />
                                            <button
                                                className="global-btn add-comment-btn"
                                                onClick={() => handleAddComment(order._id)}
                                            >
                                                Add
                                            </button>

                                        </div>
                                        <button className="global-btn edit-btn" onClick={(e) => {
                                            e.stopPropagation();
                                            handleEditClick(order._id);
                                        }}>Edit</button>
                                        <table className="edit-table">
                                            <tbody>
                                            {expandedRow === order._id && (
                                                <tr className="additional-row">
                                                    <td colSpan={15}>
                                                        {editingOrderId === order._id && (
                                                            <EditOrder
                                                                order={order}
                                                                onSave={handleSaveEdit}
                                                                onCancel={handleCancelEdit}
                                                            />
                                                        )}
                                                    </td>
                                                </tr>
                                            )}
                                            </tbody>
                                        </table>
                                    </div>

                                </td>
                            </tr>
                        )}
                    </React.Fragment>
                ))}
                </tbody>
            </table>
            <div className="pagination-controls">
                {renderPagination()}
            </div>

        </div>
    );
};

export default OrdersTable
