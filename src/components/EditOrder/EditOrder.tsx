import React, {useEffect, useState} from 'react';
import {Order} from "../../types/order.types";
import './EditOrder.css';
import {useDispatch} from "../../hooks/custom.hooks";
import {fetchOrders} from "../../slices/orders.slice";
import {useSelector} from "react-redux";
import {RootState} from "../../store/store";

interface EditOrderProps {
    order: Order;
}

const EditOrder: React.FC<EditOrderProps> = ({order}) => {
    const [editData, setEditData] = useState<Partial<Order>>({
        name: order.name,
        surname: order.surname,
        email: order.email,
        phone: order.phone,
        age: order.age,
        course: order.course,
        course_format: order.course_format,
        course_type: order.course_type,
        sum: order.sum,
        already_paid: order.already_paid,
        status: order.status,
        group: order.group,
        manager: order.manager,
        msg: order.msg,
    });
    const [isVisible, setIsVisible] = useState(true);
    const dispatch = useDispatch();
    const currentPage = useSelector((state: RootState) => state.orders.currentPage);
    const sortBy = useSelector((state: RootState) => state.orders.sortBy);
    const sortOrder = useSelector((state: RootState) => state.orders.sortOrder);
    const searchCriteria = useSelector((state: RootState) => state.orders.searchCriteria);
    const handleChange = (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLSelectElement> | React.ChangeEvent<HTMLTextAreaElement>) => {
        const target = e.target;
        const value = target.type === 'checkbox' ? (target as HTMLInputElement).checked : target.value;
        setEditData(prev => ({
            ...prev,
            [target.name]: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const token = localStorage.getItem('token');

        if (!token) {
            console.error("No token found");
            return;
        }

        try {
            const response = await fetch(`http://localhost:8080/api/orders/${order._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(editData),
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

            setIsVisible(false);
        } catch (error) {
            console.error('Error updating order:', error);
        }
    };
    const handleCancelEdit = () => {
        setIsVisible(false);
    };

    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = 'auto';
        };
    }, []);

    if (!isVisible) return null;

    return (
        <div className="edit-order global-modal">
            <form onSubmit={handleSubmit}>
                <label>
                    Name:
                    <input name="name" type="text" value={editData.name || ''} onChange={handleChange}/>
                </label>

                <label>
                    Lastname:
                    <input name="surname" type="text" value={editData.surname || ''} onChange={handleChange}/>
                </label>

                <label>
                    Age:
                    <input name="age" type="number" value={editData.age || ''} onChange={handleChange}/>
                </label>

                <label>
                    Already Paid:
                    <select
                        name="already_paid"
                        value={editData.already_paid?.toString() || ''}
                        onChange={handleChange}
                    >
                        <option value="">Select</option>
                        <option value="true">Yes</option>
                        <option value="false">No</option>
                    </select>
                </label>


                <label>
                    Email:
                    <input name="email" type="email" value={editData.email || ''} onChange={handleChange}/>
                </label>

                <label>
                    Phone:
                    <input name="phone" type="text" value={editData.phone || ''} onChange={handleChange}/>
                </label>

                <label>
                    Status:
                    <select name="status" value={editData.status || 'select'} onChange={handleChange}>
                        <option value="">Select</option>
                        {['pending', 'completed', 'cancelled', 'in work', 'dubbing'].map((statusOption) => (
                            <option key={statusOption} value={statusOption}>
                                {statusOption}
                            </option>
                        ))}
                    </select>
                </label>

                <label>
                    Sum:
                    <input name="sum" type="number" value={editData.sum || ''} onChange={handleChange}/>
                </label>

                <label>
                    Course:
                    <select
                        name="course_type"
                        value={editData.course_type || ''}
                        onChange={handleChange}
                    >
                        <option value="">Select</option>
                        {['QACX', 'PCX', 'JSCX', 'JCX', 'FS', 'FE'].map((type) => (
                            <option key={type} value={type}>{type}</option>
                        ))}
                    </select>
                </label>

                <label>
                    Course format:
                    <input name="course_format" type="text" value={editData.course_format || ''}
                           onChange={handleChange}/>
                </label>

                <label>
                    Course type:
                    <input name="course_type" type="text" value={editData.course_type || ''} onChange={handleChange}/>
                </label>

                <label>
                    Group:
                    <input name="group" type="text" value={editData.group || ''} onChange={handleChange}/>
                </label>
                <button type="submit">Save</button>
                <button type="button" onClick={handleCancelEdit}>Cancel</button>
            </form>
        </div>
    );
};

export default EditOrder;
