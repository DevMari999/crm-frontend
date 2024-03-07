import React, {useState} from 'react';
import {Order} from "../../types/order.types";
import EditOrder from "../EditOrder/EditOrder";
import './OrderDetails.css';
// @ts-ignore
import edit from "../../assets/edit.png";
// @ts-ignore
import dlt from "../../assets/delete2.png";
// @ts-ignore
import dltHover from "../../assets/delete-hover.png";
import {useDispatch} from "../../hooks/custom.hooks";
import {deleteCommentFromOrder} from "../../slices/orders.slice";

interface OrderDetailsProps {
    order: Order;
    commentInput: string;
    setCommentInput: React.Dispatch<React.SetStateAction<{ [orderId: string]: string }>>;
    handleAddComment: (orderId: string) => Promise<void>;
    editingOrderId: string | null;
    handleEditClick: () => void;
    handleSaveEdit: (orderId: string, updatedOrderData: Partial<Order>) => Promise<void>;
    handleCancelEdit: () => void;
    updateComment: (orderId: string, comment: string) => void;
}

const OrderDetails: React.FC<OrderDetailsProps> = ({
                                                       order,
                                                       commentInput,
                                                       handleAddComment,
                                                       editingOrderId,
                                                       handleEditClick,
                                                       handleSaveEdit,
                                                       handleCancelEdit,
                                                       updateComment
                                                   }) => {

    const [hoveredCommentId, setHoveredCommentId] = useState<string | null>(null);
    const token = localStorage.getItem('token');
    const dispatch = useDispatch();

    const handleDeleteComment = async (commentId: string, isPersisted: boolean, commentIndex: number) => {
        if (isPersisted && token) {
            try {

                await dispatch(deleteCommentFromOrder({ orderId: order._id, commentId, token })).unwrap();

                console.log("Comment deleted successfully.");
            } catch (error) {
                console.error("Failed to delete comment:", error);
            }
        } else {
        }
    };

    return (
        <div className="additional">
            <div className="additional-info">
                <div><b>message: </b>{order.msg || 'N/A'}</div>
                <div><b>utm:</b> {order.utm || 'N/A'}</div>
            </div>
            <div className="comments-input">
                <div className="comments-section">
                    {order.comments && order.comments.map((comment, commentIndex) => (
                        <div key={comment._id} className="comment global-block">
                            <p className="comment-p">
                                {comment.comment}
                            </p>
                            <p className="date-highlight">
                                {new Date(comment.createdAt).toLocaleDateString()} {new Date(comment.createdAt).toLocaleTimeString([], {
                                hour: '2-digit',
                                minute: '2-digit'
                            })}
                                <img
                                    src={hoveredCommentId === comment._id ? dltHover : dlt}
                                    alt="delete"
                                    className="delete"
                                    onMouseEnter={() => setHoveredCommentId(comment._id)}
                                    onMouseLeave={() => setHoveredCommentId(null)}
                                    onClick={() => handleDeleteComment(comment._id, true, commentIndex)}
                                />
                            </p>
                        </div>
                    ))}

                </div>
                <div className="comment-text-area">
                    <textarea
                        className="add-comment"
                        placeholder="Add a comment"
                        value={commentInput || ''}
                        onChange={(e) => updateComment(order._id, e.target.value)}
                    />
                    <button
                        className="global-btn add-comment-btn"
                        onClick={() => handleAddComment(order._id)}
                    >
                        Add
                    </button>
                </div>
            </div>
            <div className="edit-btn" onClick={handleEditClick}>
                <img src={edit} alt="edit"/>
            </div>
            {editingOrderId === order._id && (
                <EditOrder
                    order={order}
                    onSave={handleSaveEdit}
                    onCancel={handleCancelEdit}
                />
            )}
        </div>
    );
};

export default OrderDetails;
