import React, {useEffect, useState} from 'react';
import {Order} from "../../types/order.types";
import './EditOrder.css';

interface EditOrderProps {
    order: Order;
    onSave: (orderId: string, updatedOrder: Partial<Order>) => void;
    onCancel: () => void;
}

const EditOrder: React.FC<EditOrderProps> = ({order, onSave, onCancel}) => {
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

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLSelectElement> | React.ChangeEvent<HTMLTextAreaElement>
    ) => {
        const {name, value, type} = e.target;

        if (e.target instanceof HTMLInputElement && type === 'checkbox') {
            const {checked} = e.target;
            setEditData({...editData, [name]: checked});
        } else {
            setEditData({...editData, [name]: value});
        }
    };


    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(order._id, editData);
    };

    useEffect(() => {
        document.body.style.overflow = 'hidden';

        return () => {
            document.body.style.overflow = 'auto';
        };
    }, []);

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
                <button type="button" onClick={onCancel}>Cancel</button>
            </form>
        </div>
    );
};

export default EditOrder;
