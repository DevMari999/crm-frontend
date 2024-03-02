import React, {useState} from 'react';
import Managers from "../Managers/Managers";
import "./AdminPanel.css";

const AdminPanel: React.FC = () => {
    const [name, setName] = useState('');
    const [lastname, setLastname] = useState('');
    const [email, setEmail] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const data = {
            name,
            lastname,
            email,
        };

        try {
            const response = await fetch('http://localhost:8080/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const responseData = await response.json();
            console.log(responseData);
            // Close the modal and reset the form
            setIsModalOpen(false);
            setName('');
            setLastname('');
            setEmail('');
            setError(null);
        } catch (error) {
            console.error('Registration failed:', error);
            setError('Registration failed. Please try again.');
        }
    };

    return (
        <div className="admin-panel-wrapper">
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
