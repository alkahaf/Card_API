import React, { useState, useEffect, useRef, Fragment } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import { FaUser, FaEdit, FaTrash } from 'react-icons/fa';
import 'react-toastify/dist/ReactToastify.css';

const EmployeePage = () => {
    const [show, setShow] = useState(false);
    const [name, setName] = useState('');
    const [age, setAge] = useState('');
    const [isActive, setIsActive] = useState(0);
    const [editID, setEditId] = useState('');
    const [editName, setEditName] = useState('');
    const [editAge, setEditAge] = useState('');
    const [editIsActive, setEditIsActive] = useState(0);
    const [data, setData] = useState([]);

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
        if (window.confirm('Are you sure to delete this employee?')) {
            axios.delete(`https://localhost:7000/api/Employee/${id}`)
                .then(() => {
                    toast.success('Employee has been deleted');
                    getData();
                }).catch((error) => toast.error(error.message));
        }
    };

    const handleUpdate = () => {
        axios.put(`https://localhost:7000/api/Employee/${editID}`, {
            id: editID, name: editName, age: editAge, isActive: editIsActive
        }).then(() => {
            setShow(false);
            getData();
            toast.success('Employee has been updated');
        }).catch((error) => toast.error(error.message));
    };

    const handleSave = () => {
        axios.post('https://localhost:7000/api/Employee', { name, age, isActive })
            .then(() => {
                getData();
                setName(''); setAge(''); setIsActive(0);
                toast.success('Employee has been added');
            })
            .catch((error) => toast.error(error.message));
    };

    return (
        <Fragment>
            <ToastContainer />
            <div className="container mx-auto p-4">
                <h1 className="text-3xl font-bold mb-6">Employee Management</h1>
                <div className="bg-white p-6 shadow-md rounded-lg">
                    <input type="text" placeholder="Enter Name" className="border p-2 m-2 w-full" value={name} onChange={(e) => setName(e.target.value)} />
                    <input type="number" placeholder="Enter Age" className="border p-2 m-2 w-full" value={age} onChange={(e) => setAge(e.target.value)} />
                    <label className="m-2">
                        <input type="checkbox" checked={isActive === 1} onChange={() => setIsActive(isActive ? 0 : 1)} /> Is Active
                    </label>
                    <button onClick={handleSave} className="bg-blue-500 text-white px-4 py-2 rounded-lg mt-4">Submit</button>
                </div>

                <table className="min-w-full table-auto mt-8">
                    <thead>
                        <tr className="bg-gray-800 text-white">
                            <th className="px-4 py-2">ID</th>
                            <th className="px-4 py-2">Name</th>
                            <th className="px-4 py-2">Age</th>
                            <th className="px-4 py-2">Status</th>
                            <th className="px-4 py-2">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.length > 0 ? (
                            data.map((item) => (
                                <tr key={item.id} className="border-b even:bg-gray-100 odd:bg-white">
                                    <td className="px-4 py-2 text-center">{item.id}</td>
                                    <td className="px-4 py-2 text-center">{item.name}</td>
                                    <td className="px-4 py-2 text-center">{item.age}</td>
                                    <td className="px-4 py-2 text-center">{item.isActive ? 'Active' : 'Inactive'}</td>
                                    <td className="px-4 py-2 flex justify-center space-x-4">
                                        <button className='text-blue-500' onClick={() => handleEdit(item.id)}><FaEdit /></button>
                                        <button className='text-red-500' onClick={() => handleDelete(item.id)}><FaTrash /></button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr><td colSpan="5" className="text-center py-4">No Employees Found</td></tr>
                        )}
                    </tbody>
                </table>
            </div>

            {show && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-8 rounded-lg">
                        <h2 className="text-xl font-bold mb-4">Edit Employee</h2>
                        <input type="text" placeholder="Enter Name" className="border p-2 mb-4 w-full" value={editName} onChange={(e) => setEditName(e.target.value)} />
                        <input type="number" placeholder="Enter Age" className="border p-2 mb-4 w-full" value={editAge} onChange={(e) => setEditAge(e.target.value)} />
                        <label>
                            <input type="checkbox" checked={editIsActive === 1} onChange={() => setEditIsActive(editIsActive ? 0 : 1)} /> Is Active
                        </label>
                        <div className="mt-4">
                            <button onClick={handleUpdate} className="bg-green-500 text-white px-4 py-2 rounded-lg mr-2">Save Changes</button>
                            <button onClick={() => setShow(false)} className="bg-gray-500 text-white px-4 py-2 rounded-lg">Cancel</button>
                        </div>
                    </div>
                </div>
            )}
        </Fragment>
    );
};

export default EmployeePage;
