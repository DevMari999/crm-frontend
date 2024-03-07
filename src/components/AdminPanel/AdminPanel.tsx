import React, {useState} from 'react';
import Managers from "../Managers/Managers";
import "./AdminPanel.css";
import StatusStatistics from "../StatusStatistics/StatusStatistics";
import DatesStatistics from "../DatesStatistics/DatesStatistics";
import CoursesStatistics from "../CoursesStatistics/CoursesStatistics";
import {useDispatch} from "../../hooks/custom.hooks";
import {addManager} from "../../slices/user.slice";
const AdminPanel: React.FC = () => {
    const [name, setName] = useState('');
    const [lastname, setLastname] = useState('');
    const [email, setEmail] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const dispatch = useDispatch();
    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const managerData = {
            name,
            lastname,
            email,
        };

        dispatch(addManager(managerData))
            .unwrap()
            .then(responseData => {
                console.log(responseData);
                setIsModalOpen(false);
                setName('');
                setLastname('');
                setEmail('');
                setError(null);
            })
            .catch(error => {
                console.error('Registration failed:', error);
                setError('Registration failed. Please try again.');
            });
    };

    return (
        <div className="admin-panel-wrapper">
            <div className="all-stats-wrapper">
                <CoursesStatistics/>
                <StatusStatistics />
                <DatesStatistics/>
            </div>
            <button className="global-btn manager-btn" onClick={() => setIsModalOpen(true)}>CREATE NEW MANAGER</button>
            {isModalOpen && (
                <div className="global-modal manager-modal">
                    <div className="modal-content">
                        <form onSubmit={handleSubmit}>
                            <div>
                                <label>Name:</label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                />
                            </div>
                            <div>
                                <label>Last Name:</label>
                                <input
                                    type="text"
                                    value={lastname}
                                    onChange={(e) => setLastname(e.target.value)}
                                />
                            </div>
                            <div>
                                <label>Email:</label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                            <button type="submit">Submit</button>
                            <button type="button" onClick={() => setIsModalOpen(false)}>Cancel</button>
                        </form>
                        {error && <div style={{color: 'red'}}>{error}</div>}
                    </div>
                </div>
            )}

            <Managers/>
        </div>
    );
};

export default AdminPanel;
