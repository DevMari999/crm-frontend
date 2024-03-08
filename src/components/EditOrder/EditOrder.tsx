import React, {useEffect} from 'react';
import {useSelector} from "react-redux";
import {fetchOrders} from "../../slices/orders.slice";
import {RootState} from "../../store/store";
import {useForm} from "react-hook-form";
import {Order} from "../../types/order.types";
import './EditOrder.css';
import {useDispatch} from "../../hooks/custom.hooks";

interface EditOrderProps {
    order: Order;
    onClose: () => void;
}

const EditOrder: React.FC<EditOrderProps> = ({order, onClose}) => {
    const dispatch = useDispatch();
    const currentPage = useSelector((state: RootState) => state.orders.currentPage);
    const sortBy = useSelector((state: RootState) => state.orders.sortBy);
    const sortOrder = useSelector((state: RootState) => state.orders.sortOrder);
    const searchCriteria = useSelector((state: RootState) => state.orders.searchCriteria);
    const {register, handleSubmit, reset, formState: {errors}} = useForm<Partial<Order>>({
        defaultValues: order
    });

    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = 'auto';
        };
    }, []);

    const onSubmit = async (data: Partial<Order>) => {
        try {
            const response = await fetch(`http://localhost:8080/api/orders/${order._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify(data),
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
            })).then(() => {
                window.scrollTo(0, window.scrollY);
                onClose();
            });
        } catch (error) {
            console.error('Error updating order:', error);
        }
    };

    return (
        <div className="edit-order global-modal">
            <form onSubmit={handleSubmit(onSubmit)}>
                <label>
                    Name:
                    <input {...register("name")} type="text"/>
                </label>

                <label>
                    Lastname:
                    <input {...register("surname")} type="text"/>
                </label>

                <label>
                    Age:
                    <input {...register("age", {valueAsNumber: true})} type="number"/>
                </label>

                <label>
                    Already Paid:
                    <select {...register("already_paid")}>
                        <option value="">Select</option>
                        <option value="true">Yes</option>
                        <option value="false">No</option>
                    </select>
                </label>

                <label>
                    Email:
                    <input {...register("email")} type="email"/>
                </label>

                <label>
                    Phone:
                    <input {...register("phone")} type="text"/>
                </label>

                <label>
                    Status:
                    <select {...register("status")}>
                        <option value="">Select</option>
                        {['pending', 'completed', 'cancelled', 'in work', 'dubbing'].map((statusOption) => (
                            <option key={statusOption} value={statusOption}>{statusOption}</option>
                        ))}
                    </select>
                </label>

                <label>
                    Sum:
                    <input {...register("sum", {valueAsNumber: true})} type="number"/>
                </label>

                <label>
                    Course:
                    <select {...register("course")}>
                        <option value="">Select</option>
                        {['QACX', 'PCX', 'JSCX', 'JCX', 'FS', 'FE'].map((type) => (
                            <option key={type} value={type}>{type}</option>
                        ))}
                    </select>
                </label>

                <label>
                    Course format:
                    <select {...register("course_format")}  >
                        <option value="">Select</option>
                        <option value="online">online</option>
                        <option value="static">static</option>
                    </select>
                </label>

                <label>
                    Course type:
                    <input {...register("course_type")} type="text"/>
                </label>

                <label>
                    Group:
                    <input {...register("group")} type="text"/>
                </label>
                <button type="submit">Save</button>
                <button type="button" onClick={onClose}>Cancel</button>

            </form>
        </div>
    );
};

export default EditOrder;
