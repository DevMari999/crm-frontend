import React, {useEffect, useState} from 'react';
import {CommentInput, Order} from "../../types";
import './OrderDetails.css';
import edit from "../../assets/edit.png";
import dlt from "../../assets/delete2.png";
import dltHover from "../../assets/delete-hover.png";
import {useDispatch} from "../../hooks";
import {
    selectComments,
    selectUser,
    selectUserId,
    selectUserRole
} from "../../store/slices";
import {
    addCommentToOrder,
    deleteCommentFromOrder, fetchCommentsForOrder
} from '../../store/thunk';
import {useSelector} from "react-redux";
import {CustomModal, EditOrder} from '../';
import {Comment} from "../../types";

interface OrderDetailsProps {
    order: Order;
    commentInput: string;
    setCommentInput: React.Dispatch<React.SetStateAction<{ [orderId: string]: string }>>;
}

const OrderDetails: React.FC<OrderDetailsProps> = ({
                                                       order,
                                                   }) => {

    const [hoveredCommentId, setHoveredCommentId] = useState<string | null>(null);
    const dispatch = useDispatch();
    const [commentInput, setCommentInput] = useState<CommentInput>({});
    const [editingOrderId, setEditingOrderId] = useState<string | null>(null);
    const currentUserId = useSelector(selectUserId);
    const currentUser = useSelector(selectUser);
    const userRole = useSelector(selectUserRole);
    const canEdit = userRole === 'admin' || order.manager === currentUserId;
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedCommentId, setSelectedCommentId] = useState<string | null>(null);
    const [comments, setComments] = useState<Comment[]>(() => order.comments || []);
    useEffect(() => {
        setComments(order.comments || []);
    }, [order.comments]);

    const promptDeleteComment = (commentId: string) => {
        setSelectedCommentId(commentId);
        setIsModalOpen(true);
    };

    const updateComment = (orderId: string, comment: string) => {
        setCommentInput(current => ({...current, [orderId]: comment}));
    };
    const handleAddComment = async (orderId: string) => {
        const comment = commentInput[orderId];

        if (!comment || !currentUser || !currentUser.name || !currentUserId) return;

        const managerName = currentUser.name;

        if (managerName) {
            dispatch(addCommentToOrder({orderId, comment, managerId: currentUserId, managerName: currentUser.name}))
                .unwrap()
                .then(() => {
                    console.log('Comment added successfully');
                    setCommentInput(current => ({...current, [orderId]: ''}));
                    dispatch(fetchCommentsForOrder(order._id)).unwrap().then((newComments) => {
                        console.log('Fetched comments:', newComments);
                        setComments(newComments);
                    });

                })
                .catch((error) => {
                    console.error('Error adding comment:', error);
                });
        }
    };

    const handleDeleteComment = async () => {
        if (!selectedCommentId) return;

        dispatch(deleteCommentFromOrder({orderId: order._id, commentId: selectedCommentId}))
            .unwrap()
            .then(() => {
                console.log("Comment deleted successfully.");
                setSelectedCommentId(null);
                setIsModalOpen(false);
                dispatch(fetchCommentsForOrder(order._id)).unwrap().then((newComments) => {
                    console.log('Fetched comments:', newComments);
                    setComments(newComments);
                });
            })
            .catch((error) => {
                console.error("Failed to delete comment:", error);
                setIsModalOpen(false);
            });
    };

    const handleEditClick = (orderId: string) => {
        setEditingOrderId(orderId);
    };
    return (
        <div className="additional">
            <div className="additional-info">
                <div><b>message: </b>{order.msg || 'N/A'}</div>
                <div><b>utm:</b> {order.utm || 'N/A'}</div>
            </div>
            <div className="comments-input">
                <div className="comments-section">
                    {comments && comments.map((comment) => (
                        <div key={Math.random()} className="comment global-block">
                            <p className="comment-p">
                                {comment.comment}
                            </p>
                            <p className="date-highlight">
                                <span>{comment.managerName}</span>
                                <span>
                                    {new Date(comment.createdAt).toLocaleDateString()} {new Date(comment.createdAt).toLocaleTimeString([], {
                                    hour: '2-digit',
                                    minute: '2-digit'
                                })}
                                </span>

                                {canEdit && (
                                    <img
                                        src={hoveredCommentId === comment._id ? dltHover : dlt}
                                        alt="delete"
                                        className="delete"
                                        onMouseEnter={() => setHoveredCommentId(comment._id)}
                                        onMouseLeave={() => setHoveredCommentId(null)}
                                        onClick={() => promptDeleteComment(comment._id)}
                                    />
                                )}

                            </p>
                        </div>
                    ))}

                </div>
                {canEdit && (
                    <div className="comment-text-area">
            <textarea
                className="add-comment"
                placeholder="Add a comment"
                value={commentInput[order._id] || ''}
                onChange={(e) => updateComment(order._id, e.target.value)}
            />
                        <button
                            className="global-btn add-comment-btn"
                            onClick={() => handleAddComment(order._id)}
                        >
                            Add
                        </button>
                    </div>
                )}
            </div>

            {canEdit && (
                <div className="edit-btn" onClick={() => handleEditClick(order._id)}>
                    <img src={edit} alt="edit"/>
                </div>
            )}

            {editingOrderId === order._id && (
                <EditOrder
                    order={order}
                    onClose={() => setEditingOrderId(null)}
                />
            )}
            {isModalOpen && (
                <CustomModal
                    message="Are you sure you want to delete this comment?"
                    onConfirm={handleDeleteComment}
                    onCancel={() => setIsModalOpen(false)}
                />
            )}

        </div>
    );
};

export default OrderDetails;
