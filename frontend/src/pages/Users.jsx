import { useEffect, useState } from 'react';
import api from '../services/api';
import Navbar from '../components/Navbar';

function Users() {

    const [users, setUsers] = useState([]);
    const [bases, setBases] = useState([]);

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('');
    const [baseId, setBaseId] = useState('');

    const [editingId, setEditingId] = useState(null);
    const [showForm, setShowForm] = useState(false);


    const getUsers = async () => {

        try {

            const response =
                await api.get('/api/users');

            setUsers(response.data);

        } catch (error) {

            console.error(
                'Users error:',
                error
            );

        }

    };


    const getBases = async () => {

        try {

            const response =
                await api.get('/api/bases');

            setBases(response.data);

        } catch (error) {

            console.error(
                'Bases error:',
                error
            );

        }

    };


    useEffect(() => {

        getUsers();
        getBases();

    }, []);


    const handleSubmit = async (e) => {

        e.preventDefault();

        try {

            const userData = {

                name: name,

                email: email,

                password: password,

                role: role,

                baseId: baseId
                    ? Number(baseId)
                    : null

            };


            if (editingId) {

                await api.put(
                    `/api/users/${editingId}`,
                    userData
                );

                alert(
                    'User updated successfully'
                );

            } else {

                await api.post(
                    '/api/users',
                    userData
                );

                alert(
                    'User created successfully'
                );

            }


            resetForm();

            getUsers();

        } catch (error) {

            console.error(
                'Save user error:',
                error
            );

            alert(
                error.response?.data ||
                'Failed to save user'
            );

        }

    };


    const handleEdit = (user) => {

        setEditingId(user.id);

        setName(user.name);

        setEmail(user.email);

        setPassword('');

        setRole(user.role);

        setBaseId(
            user.baseId || ''
        );

        setShowForm(true);

    };


    const handleDelete = async (id) => {

        const confirmDelete = window.confirm(
            'Are you sure you want to delete this user?'
        );

        if (!confirmDelete) {
            return;
        }


        try {

            await api.delete(
                `/api/users/${id}`
            );

            alert(
                'User deleted successfully'
            );

            getUsers();

        } catch (error) {

            console.error(
                'Delete user error:',
                error
            );

            alert(
                error.response?.data ||
                'Failed to delete user'
            );

        }

    };


    const resetForm = () => {

        setEditingId(null);

        setName('');

        setEmail('');

        setPassword('');

        setRole('');

        setBaseId('');

        setShowForm(false);

    };


    const openAddForm = () => {

        resetForm();

        setShowForm(true);

    };


    return (

        <div
            style={{
                minHeight: '100vh',
                backgroundColor: '#cbf3f0'
            }}
        >

            <Navbar />


            <main
                style={{
                    width: '100%',
                    maxWidth: '1250px',
                    margin: '0 auto',
                    padding: '38px 30px 60px',
                    boxSizing: 'border-box'
                }}
            >

                {/* HEADER */}

                <div
                    style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'flex-end',
                        marginBottom: '28px'
                    }}
                >

                    <div>

                        <h1
                            style={{
                                margin: 0,
                                fontSize: '30px',
                                fontWeight: '600',
                                color: '#111827'
                            }}
                        >
                            Users
                        </h1>

                        <p
                            style={{
                                margin: '7px 0 0',
                                fontSize: '14px',
                                color: '#6b7280'
                            }}
                        >
                            Manage system users and their access roles
                        </p>

                    </div>


                    {!showForm && (

                        <button
                            onClick={openAddForm}
                            style={{
                                height: '40px',
                                padding: '0 18px',
                                border: 'none',
                                borderRadius: '6px',
                                backgroundColor: '#172554',
                                color: 'white',
                                fontSize: '14px',
                                fontWeight: '500',
                                cursor: 'pointer'
                            }}
                        >
                            Add User
                        </button>

                    )}

                </div>


                {/* FORM */}

                {showForm && (

                    <div
                        style={{
                            backgroundColor: 'white',
                            border: '1px solid #e5e7eb',
                            borderRadius: '8px',
                            padding: '22px',
                            marginBottom: '28px'
                        }}
                    >

                        <div
                            style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                marginBottom: '20px'
                            }}
                        >

                            <h2
                                style={{
                                    margin: 0,
                                    fontSize: '17px',
                                    fontWeight: '600',
                                    color: '#1f2937'
                                }}
                            >
                                {editingId
                                    ? 'Edit User'
                                    : 'Add New User'}
                            </h2>


                            <button
                                type="button"
                                onClick={resetForm}
                                style={{
                                    border: 'none',
                                    background: 'transparent',
                                    color: '#6b7280',
                                    fontSize: '14px',
                                    cursor: 'pointer'
                                }}
                            >
                                Cancel
                            </button>

                        </div>


                        <form
                            onSubmit={handleSubmit}
                            style={{
                                display: 'grid',
                                gridTemplateColumns:
                                    '1fr 1fr 1fr',
                                gap: '16px'
                            }}
                        >

                            {/* NAME */}

                            <div>

                                <label style={labelStyle}>
                                    Name
                                </label>

                                <input
                                    type="text"
                                    placeholder="Enter name"
                                    value={name}
                                    onChange={(e) =>
                                        setName(e.target.value)
                                    }
                                    required
                                    style={inputStyle}
                                />

                            </div>


                            {/* EMAIL */}

                            <div>

                                <label style={labelStyle}>
                                    Email
                                </label>

                                <input
                                    type="email"
                                    placeholder="Enter email"
                                    value={email}
                                    onChange={(e) =>
                                        setEmail(e.target.value)
                                    }
                                    required
                                    style={inputStyle}
                                />

                            </div>


                            {/* PASSWORD */}

                            <div>

                                <label style={labelStyle}>
                                    Password
                                </label>

                                <input
                                    type="password"
                                    placeholder={
                                        editingId
                                            ? 'Enter new password'
                                            : 'Enter password'
                                    }
                                    value={password}
                                    onChange={(e) =>
                                        setPassword(e.target.value)
                                    }
                                    required={!editingId}
                                    style={inputStyle}
                                />

                            </div>


                            {/* ROLE */}

                            <div>

                                <label style={labelStyle}>
                                    Role
                                </label>

                                <select
                                    value={role}
                                    onChange={(e) =>
                                        setRole(e.target.value)
                                    }
                                    required
                                    style={selectStyle}
                                >

                                    <option value="">
                                        Select Role
                                    </option>

                                    <option value="ADMIN">
                                        Admin
                                    </option>

                                    <option value="BASE_COMMANDER">
                                        Base Commander
                                    </option>

                                    <option value="LOGISTICS_OFFICER">
                                        Logistics Officer
                                    </option>

                                </select>

                            </div>


                            {/* BASE */}

                            <div>

                                <label style={labelStyle}>
                                    Base
                                </label>

                                <select
                                    value={baseId}
                                    onChange={(e) =>
                                        setBaseId(e.target.value)
                                    }
                                    style={selectStyle}
                                >

                                    <option value="">
                                        No Base
                                    </option>

                                    {bases.map((base) => (

                                        <option
                                            key={base.id}
                                            value={base.id}
                                        >
                                            {base.name}
                                        </option>

                                    ))}

                                </select>

                            </div>


                            {/* BUTTON */}

                            <div
                                style={{
                                    display: 'flex',
                                    alignItems: 'flex-end'
                                }}
                            >

                                <button
                                    type="submit"
                                    style={{
                                        width: '100%',
                                        height: '42px',
                                        border: 'none',
                                        borderRadius: '6px',
                                        backgroundColor: '#172554',
                                        color: 'white',
                                        fontSize: '14px',
                                        cursor: 'pointer'
                                    }}
                                >
                                    {editingId
                                        ? 'Update User'
                                        : 'Save User'}
                                </button>

                            </div>

                        </form>

                    </div>

                )}


                {/* LIST HEADER */}

                <div
                    style={{
                        marginBottom: '14px'
                    }}
                >

                    <h2
                        style={{
                            margin: 0,
                            fontSize: '18px',
                            fontWeight: '600',
                            color: '#1f2937'
                        }}
                    >
                        System Users
                    </h2>

                    <p
                        style={{
                            margin: '4px 0 0',
                            fontSize: '13px',
                            color: '#9ca3af'
                        }}
                    >
                        {users.length} user
                        {users.length !== 1
                            ? 's'
                            : ''} registered
                    </p>

                </div>


                {/* TABLE */}

                <div
                    style={{
                        backgroundColor: 'white',
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px',
                        overflowX: 'auto'
                    }}
                >

                    <table
                        style={{
                            width: '100%',
                            borderCollapse: 'collapse',
                            minWidth: '950px'
                        }}
                    >

                        <thead>

                            <tr>

                                <th style={headerStyle}>
                                    ID
                                </th>

                                <th style={headerStyle}>
                                    Name
                                </th>

                                <th style={headerStyle}>
                                    Email
                                </th>

                                <th style={headerStyle}>
                                    Role
                                </th>

                                <th style={headerStyle}>
                                    Base ID
                                </th>

                                <th style={headerStyle}>
                                    Actions
                                </th>

                            </tr>

                        </thead>


                        <tbody>

                            {users.length === 0 ? (

                                <tr>

                                    <td
                                        colSpan="6"
                                        style={{
                                            padding: '45px 20px',
                                            textAlign: 'center',
                                            color: '#9ca3af',
                                            fontSize: '14px'
                                        }}
                                    >
                                        No users found
                                    </td>

                                </tr>

                            ) : (

                                users.map((user) => (

                                    <tr key={user.id}>

                                        <td style={cellStyle}>
                                            {user.id}
                                        </td>

                                        <td
                                            style={{
                                                ...cellStyle,
                                                color: '#1f2937',
                                                fontWeight: '500'
                                            }}
                                        >
                                            {user.name}
                                        </td>

                                        <td style={cellStyle}>
                                            {user.email}
                                        </td>

                                        <td style={cellStyle}>

                                            <span
                                                style={{
                                                    display: 'inline-block',
                                                    padding: '5px 9px',
                                                    borderRadius: '5px',
                                                    backgroundColor: '#f1f5f9',
                                                    color: '#334155',
                                                    fontSize: '12px',
                                                    fontWeight: '600'
                                                }}
                                            >
                                                {user.role}
                                            </span>

                                        </td>

                                        <td style={cellStyle}>
                                            {user.baseId || '-'}
                                        </td>

                                        <td style={cellStyle}>

                                            <div
                                                style={{
                                                    display: 'flex',
                                                    gap: '8px'
                                                }}
                                            >

                                                <button
                                                    onClick={() =>
                                                        handleEdit(user)
                                                    }
                                                    style={{
                                                        height: '32px',
                                                        padding: '0 12px',
                                                        border: '1px solid #cbd5e1',
                                                        borderRadius: '5px',
                                                        backgroundColor: 'white',
                                                        color: '#334155',
                                                        fontSize: '13px',
                                                        cursor: 'pointer'
                                                    }}
                                                >
                                                    Edit
                                                </button>


                                                <button
                                                    onClick={() =>
                                                        handleDelete(
                                                            user.id
                                                        )
                                                    }
                                                    style={{
                                                        height: '32px',
                                                        padding: '0 12px',
                                                        border: '1px solid #fecaca',
                                                        borderRadius: '5px',
                                                        backgroundColor: '#fffafa',
                                                        color: '#b91c1c',
                                                        fontSize: '13px',
                                                        cursor: 'pointer'
                                                    }}
                                                >
                                                    Delete
                                                </button>

                                            </div>

                                        </td>

                                    </tr>

                                ))

                            )}

                        </tbody>

                    </table>

                </div>

            </main>

        </div>
    );
}


const labelStyle = {
    display: 'block',
    marginBottom: '7px',
    fontSize: '13px',
    fontWeight: '500',
    color: '#374151'
};


const inputStyle = {
    width: '100%',
    height: '42px',
    padding: '0 12px',
    border: '1px solid #d1d5db',
    borderRadius: '6px',
    outline: 'none',
    fontSize: '14px',
    color: '#1f2937',
    boxSizing: 'border-box'
};


const selectStyle = {
    width: '100%',
    height: '42px',
    padding: '0 12px',
    border: '1px solid #d1d5db',
    borderRadius: '6px',
    outline: 'none',
    fontSize: '14px',
    color: '#1f2937',
    backgroundColor: 'white',
    boxSizing: 'border-box'
};


const headerStyle = {
    padding: '14px 18px',
    backgroundColor: '#f8fafc',
    borderBottom: '1px solid #e5e7eb',
    color: '#475569',
    textAlign: 'left',
    fontSize: '13px',
    fontWeight: '600'
};


const cellStyle = {
    padding: '17px 18px',
    borderBottom: '1px solid #f1f5f9',
    color: '#64748b',
    fontSize: '14px'
};


export default Users;