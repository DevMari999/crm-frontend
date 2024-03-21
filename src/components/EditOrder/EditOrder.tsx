import React, {useEffect, useState} from 'react';
import {useSelector} from "react-redux";
import {fetchOrders, fetchUniqueGroupNames} from "../../store/thunk";
import {RootState} from "../../store/store";
import {useForm} from "react-hook-form";
import {Order} from "../../types";
import {useDispatch} from "../../hooks";
import {restoreScrollPosition} from "../../utils/scrollPositionUtils";
import "./EditOrder.css";
import config from "../../configs/configs";
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
    const {register, handleSubmit, reset, formState: {errors}, watch, setValue} = useForm<Partial<Order>>({
        defaultValues: order
    });
    const uniqueGroupNames = useSelector((state: RootState) => state.orders.uniqueGroupNames);
    const [isAddingNewGroup, setIsAddingNewGroup] = useState(false);
    useEffect(() => {
        document.body.style.overflow = 'hidden';
        dispatch(fetchUniqueGroupNames());
        return () => {
            document.body.style.overflow = 'auto';
        };
    }, [dispatch]);

    useEffect(() => {
        document.body.style.overflow = 'hidden';

        dispatch(fetchUniqueGroupNames());
        return () => {
            document.body.style.overflow = 'auto';
        };
    }, [dispatch]);

    const handleGroupChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        if (e.target.value === 'newGroup') {
            setIsAddingNewGroup(true);
            setValue('group', '');
        } else {
            setIsAddingNewGroup(false);
            setValue('group', e.target.value);
        }
    };

    const onSubmit = async (data: Partial<Order>) => {
        console.log(typeof data.already_paid);
        try {
            const currentScrollPosition = window.scrollY;

            const response = await fetch(`${config.baseUrl}/api/orders/${order._id}`, {
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
                restoreScrollPosition(currentScrollPosition);
                onClose();
            });
        } catch (error) {
            console.error('Error updating order:', error);
        }
    };

    return (
        <div className="edit-order global-modal">
            <form  className="edit-form" onSubmit={handleSubmit(onSubmit)}>
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
                        {['pending', 'completed', 'cancelled', 'in work', 'dubbing', 'new'].map((statusOption) => (
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
                    <select {...register("course_type")}  >
                        <option value="">Select</option>
                        <option value="vip">vip</option>
                        <option value="premium">premium</option>
                        <option value="minimal">minimal</option>
                        <option value="pro">pro</option>
                        <option value="incubator">incubator</option>
                    </select>
                </label>

                <label>
                    Group:
                    {!isAddingNewGroup ? (
                        <select {...register('group')} onChange={handleGroupChange}>
                            <option value="">Select Group</option>
                            {uniqueGroupNames.map((name) => (
                                <option key={name} value={name}>
                                    {name}
                                </option>
                            ))}
                            <option value="newGroup">+ Add New Group</option>
                        </select>
                    ) : (
                        <input
                            {...register('group')}
                            type="text"
                            placeholder="New group name"
                        />
                    )}
                </label>
                <button className="modal-btn-submit">Save</button>
                <button className="modal-btn-cancel" onClick={onClose}>Cancel</button>

            </form>
        </div>
    );
};

export default EditOrder;
