import React, {useEffect} from 'react';
import Managers from "../Managers/Managers";
import "./AdminPanel.css";
import StatusStatistics from "../StatusStatistics/StatusStatistics";
import DatesStatistics from "../DatesStatistics/DatesStatistics";
import CoursesStatistics from "../CoursesStatistics/CoursesStatistics";
import {useForm} from 'react-hook-form';
import {useDispatch} from "../../hooks/custom.hooks";
import {addManager} from "../../slices/user.slice";

const AdminPanel: React.FC = () => {
    const {register, handleSubmit, reset, formState: {errors}} = useForm<{
        name: string;
        lastname: string;
        email: string;
    }>();
    const [isModalOpen, setIsModalOpen] = React.useState(false);
    const [error, setError] = React.useState<string | null>(null);
    const dispatch = useDispatch();
    useEffect(() => {

        const body = document.body;
        const prevOverflow = body.style.overflow;

        if (isModalOpen) {
            body.style.overflow = 'hidden';
        } else {
            body.style.overflow = prevOverflow;
        }

        return () => {
            body.style.overflow = prevOverflow;
        };
    }, [isModalOpen]);

    const onSubmit = async (data: { name: string; lastname: string; email: string; }) => {
        dispatch(addManager(data))
            .unwrap()
            .then(responseData => {
                console.log(responseData);
                setIsModalOpen(false);
                reset();
                setError(null);
            })
            .catch(error => {
                console.error('Registration failed:', error);
                setError('Registration failed. Please try again.');
            });
    };

    return (
        <div className="admin-panel-wrapper">
            <div className="all-stats-wrapper global-block">
                <div className="stats-each">
                    <h3>COURSES</h3>
                    <CoursesStatistics/>
                </div>
                <div className="stats-each">
                    <h3>STATUS</h3>
                    <StatusStatistics/>
                </div>
                <div className="stats-each">
                    <h3>ORDERS</h3>
                    <DatesStatistics/>
                </div>
            </div>
            <button className="global-btn manager-btn" onClick={() => setIsModalOpen(true)}>CREATE NEW MANAGER</button>
            {isModalOpen && (
                <div className="global-modal manager-modal">
                    <div className="modal-content">
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <div>
                                <label>Name:</label>
                                <input className="manager-input" {...register("name", {required: "Name is required"})}
                                       type="text"/>
                                {errors.name && <p style={{color: 'red'}}>{errors.name.message}</p>}
                            </div>
                            <div>
                                <label>Last Name:</label>
                                <input
                                    className="manager-input" {...register("lastname", {required: "Last name is required"})}
                                    type="text"/>
                                {errors.lastname && <p style={{color: 'red'}}>{errors.lastname.message}</p>}
                            </div>
                            <div>
                                <label>Email:</label>
                                <input
                                    className="manager-input" {...register("email", {required: "Email is required", pattern: /^\S+@\S+$/i})}
                                    type="email"/>
                                {errors.email && <p style={{color: 'red'}}>{errors.email.message}</p>}
                            </div>
                            {error && <div style={{color: 'red'}}>{error}</div>}
                            <button className="modal-btn-submit">Submit</button>
                            <button className="modal-btn-cancel" onClick={() => setIsModalOpen(false)}>Cancel</button>
                        </form>
                    </div>
                </div>
            )}
            <Managers/>
        </div>
    );
};

export default AdminPanel;
