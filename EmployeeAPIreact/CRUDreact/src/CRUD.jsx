import React, { useState, useEffect, useRef, Fragment } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import { motion } from 'framer-motion';
import { FaUser, FaEdit, FaTrash } from 'react-icons/fa';
import 'react-toastify/dist/ReactToastify.css';

const CRUD = () => {
    const [show, setShow] = useState(false);
    const [name, setName] = useState('');
    const [age, setAge] = useState('');
    const [isActive, setIsActive] = useState(0);
    const [editID, setEditId] = useState('');
    const [editName, setEditName] = useState('');
    const [editAge, setEditAge] = useState('');
    const [editIsActive, setEditIsActive] = useState(0);
    const [data, setData] = useState([]);
    const ref = useRef(null);

    useEffect(() => {
        getData();
    }, []);

    const getData = () => {
        axios.get('https://localhost:7000/api/Employee')
            .then((result) => setData(result.data))
            .catch((error) => console.log(error));
    };

    const handleEdit = (id) => {
        setShow(true);
        axios.get(`https://localhost:7000/api/Employee/${id}`)
            .then((result) => {
                setEditName(result.data.name);
                setEditAge(result.data.age);
                setEditIsActive(result.data.isActive);
                setEditId(id);
            })
            .catch((error) => console.log(error));
    };

    const handleDelete = (id) => {
        if (window.confirm("Are you sure to delete this employee?")) {
            axios.delete(`https://localhost:7000/api/Employee/${id}`)
                .then(() => {
                    toast.success('Employee has been deleted');
                    getData();
                }).catch((error) => toast.error(error));
        }
    };

    const handleUpdate = () => {
        axios.put(`https://localhost:7000/api/Employee/${editID}`, {
            id: editID, name: editName, age: editAge, isActive: editIsActive
        }).then(() => {
            setShow(false);
            getData();
            toast.success('Employee has been updated');
        }).catch((error) => toast.error(error));
    };

    const handleSave = () => {
        axios.post('https://localhost:7000/api/Employee', { name, age, isActive })
            .then(() => {
                getData();
                setName(''); setAge(''); setIsActive(0);
                toast.success('Employee has been added');
            })
            .catch((error) => toast.error(error));
    };

    return (
        <Fragment>
            <ToastContainer />
            <div className="form-container">
                <input type="text" placeholder="Enter Name" value={name} onChange={(e) => setName(e.target.value)} />
                <input type="text" placeholder="Enter Age" value={age} onChange={(e) => setAge(e.target.value)} />
                <label>
                    <input type="checkbox" checked={isActive === 1} onChange={() => setIsActive(isActive ? 0 : 1)} /> IsActive
                </label>
                <button onClick={handleSave}>Submit</button>
            </div>

            <div ref={ref} className='flex flex-wrap gap-5 p-5'>
                {data.length > 0 ? (
                    data.map((item) => (
                        <motion.div 
                            key={item.id} 
                            drag 
                            dragConstraints={ref} 
                            whileDrag={{ scale: 1.1 }}
                            className='w-60 p-5 bg-gray-800 text-white rounded-lg shadow-lg relative'>
                            <FaUser className='text-4xl mx-auto' />
                            <h3 className='text-lg font-bold mt-3'>{item.name}</h3>
                            <p>Age: {item.age}</p>
                            <p>Status: {item.isActive ? 'Active' : 'Inactive'}</p>
                            <div className='flex justify-between mt-3'>
                                <button className='text-blue-500' onClick={() => handleEdit(item.id)}><FaEdit /></button>
                                <button className='text-red-500' onClick={() => handleDelete(item.id)}><FaTrash /></button>
                            </div>
                        </motion.div>
                    ))
                ) : (
                    <p>Loading...</p>
                )}
            </div>

            {show && (
                <div className="modal">
                    <div className="modal-content">
                        <span className="close" onClick={() => setShow(false)}>&times;</span>
                        <h2>Edit Employee</h2>
                        <input type="text" placeholder="Enter Name" value={editName} onChange={(e) => setEditName(e.target.value)} />
                        <input type="text" placeholder="Enter Age" value={editAge} onChange={(e) => setEditAge(e.target.value)} />
                        <label>
                            <input type="checkbox" checked={editIsActive === 1} onChange={() => setEditIsActive(editIsActive ? 0 : 1)} /> IsActive
                        </label>
                        <button onClick={handleUpdate}>Save Changes</button>
                    </div>
                </div>
            )}
        </Fragment>
    );
};

export default CRUD;
