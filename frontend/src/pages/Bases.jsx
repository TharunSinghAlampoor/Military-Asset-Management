import { useEffect, useState } from 'react';
import api from '../services/api';
import Navbar from '../components/Navbar';

function Bases() {

    const [bases, setBases] = useState([]);

    const [name, setName] = useState('');
    const [location, setLocation] = useState('');

    const [editingId, setEditingId] = useState(null);
    const [showForm, setShowForm] = useState(false);


    const getBases = async () => {

        try {

            const response = await api.get('/api/bases');

            setBases(response.data);

        } catch (error) {

            console.error('Bases error:', error);

        }

    };


    useEffect(() => {

        getBases();

    }, []);


    const handleSubmit = async (e) => {

        e.preventDefault();

        try {

            const baseData = {
                name: name,
                location: location
            };

            if (editingId) {

                await api.put(
                    `/api/bases/${editingId}`,
                    baseData
                );

                alert('Base updated successfully');

            } else {

                await api.post(
                    '/api/bases',
                    baseData
                );

                alert('Base created successfully');

            }

            setName('');
            setLocation('');
            setEditingId(null);
            setShowForm(false);

            getBases();

        } catch (error) {

            console.error('Save base error:', error);

            alert('Failed to save base');

        }

    };


    const handleEdit = (base) => {

        setEditingId(base.id);

        setName(base.name);

        setLocation(base.location);

        setShowForm(true);

    };


    const handleDelete = async (id) => {

        const confirmDelete = window.confirm(
            'Are you sure you want to delete this base?'
        );

        if (!confirmDelete) {
            return;
        }

        try {

            await api.delete(`/api/bases/${id}`);

            alert('Base deleted successfully');

            getBases();

        } catch (error) {

            console.error('Delete base error:', error);

            alert('Failed to delete base');

        }

    };


    const handleCancel = () => {

        setEditingId(null);

        setName('');

        setLocation('');

        setShowForm(false);

    };


    const openAddForm = () => {

        setEditingId(null);

        setName('');

        setLocation('');

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
                    maxWidth: '1200px',
                    margin: '0 auto',
                    padding: '38px 30px 60px',
                    boxSizing: 'border-box'
                }}
            >

                {/* =====================================
                    HEADER
                ===================================== */}

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
                                fontSize: '27px',
                                fontWeight: '600',
                                color: 'black'
                            }}
                        >
                            Bases
                        </h1>
                    </div>


                    {!showForm && (

                        <button
                            onClick={openAddForm}
                            style={{
                                height: '40px',
                                padding: '0 18px',
                                border: 'none',
                                borderRadius: '6px',
                                backgroundColor: '#5b8266',
                                color: 'white',
                                fontSize: '14px',
                                fontWeight: '500',
                                cursor: 'pointer'
                            }}
                        >
                            Add Base
                        </button>

                    )}

                </div>


                {/* =====================================
                    ADD / EDIT FORM
                ===================================== */}

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
                                    ? 'Edit Base'
                                    : 'Add New Base'}
                            </h2>


                            <button
                                type="button"
                                onClick={handleCancel}
                                style={{
                                    border: 'none',
                                    background: 'white',
                                    color: 'red',
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
                                    '1fr 1fr auto',
                                gap: '14px',
                                alignItems: 'end'
                            }}
                        >

                            <div>

                                <label
                                    style={{
                                        display: 'block',
                                        marginBottom: '7px',
                                        fontSize: '16px',
                                        fontWeight: 'bold',
                                        color: '#374151'
                                    }}
                                >
                                    Base Name
                                </label>

                                <input
                                    type="text"
                                    placeholder="Enter base name"
                                    value={name}
                                    onChange={(e) =>
                                        setName(e.target.value)
                                    }
                                    required
                                    style={{
                                        width: '100%',
                                        height: '42px',
                                        padding: '0 12px',
                                        border: '1px solid #d1d5db',
                                        borderRadius: '6px',
                                        outline: 'none',
                                        fontSize: '14px',
                                        color: '#1f2937'
                                    }}
                                />

                            </div>


                            <div>

                                <label
                                    style={{
                                        display: 'block',
                                        marginBottom: '7px',
                                        fontSize: '16px',
                                        fontWeight: 'bold',
                                        color: '#374151'
                                    }}
                                >
                                    Location
                                </label>

                                <input
                                    type="text"
                                    placeholder="Enter location"
                                    value={location}
                                    onChange={(e) =>
                                        setLocation(e.target.value)
                                    }
                                    required
                                    style={{
                                        width: '100%',
                                        height: '42px',
                                        padding: '0 12px',
                                        border: '1px solid #d1d5db',
                                        borderRadius: '6px',
                                        outline: 'none',
                                        fontSize: '14px',
                                        color: '#1f2937'
                                    }}
                                />

                            </div>


                            <button
                                type="submit"
                                style={{
                                    height: '42px',
                                    padding: '0 20px',
                                    border: 'none',
                                    borderRadius: '6px',
                                    backgroundColor: 'green',
                                    color: 'white',
                                    fontSize: '14px',
                                    cursor: 'pointer',
                                    whiteSpace: 'nowrap'
                                }}
                            >
                                {editingId
                                    ? 'Update Base'
                                    : 'Save Base'}
                            </button>

                        </form>

                    </div>

                )}


                {/* =====================================
                    TABLE HEADER
                ===================================== */}

                <div
                    style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: '14px'
                    }}
                >

                    <div>

                        <h2
                            style={{
                                margin: 0,
                                fontSize: '18px',
                                fontWeight: '600',
                                color: 'black',
                                fontWeight: 'bold'
                            }}
                        >
                            All Bases
                        </h2>

                        <p
                            style={{
                                margin: '4px 0 0',
                                fontSize: '13px',
                                color: '#9ca3af'
                            }}
                        >
                            {bases.length} base
                            {bases.length !== 1 ? 's' : ''} registered
                        </p>

                    </div>

                </div>


                {/* =====================================
                    TABLE
                ===================================== */}

                <div
                    style={{
                        backgroundColor: 'white',
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px',
                        overflow: 'hidden'
                    }}
                >

                    <table
                        style={{
                            width: '100%',
                            borderCollapse: 'collapse',
                            tableLayout: 'fixed'
                        }}
                    >

                        <thead>

                            <tr>

                                <th
                                    style={{
                                        width: '12%',
                                        padding: '14px 20px',
                                        backgroundColor: '#ADD8E6',
                                        borderBottom: '1px solid #e5e7eb',
                                        color: 'black',
                                        textAlign: 'center',
                                        fontSize: '16px',
                                        fontWeight: 'bold'
                                    }}
                                >
                                    ID
                                </th>

                                <th
                                    style={{
                                        width: '38%',
                                        padding: '14px 20px',
                                        backgroundColor: '#ADD8E6',
                                        borderBottom: '1px solid #e5e7eb',
                                        color: 'black',
                                        textAlign: 'center',
                                        fontSize: '16px',
                                        fontWeight: 'bold'
                                    }}
                                >
                                    Base Name
                                </th>

                                <th
                                    style={{
                                        width: '30%',
                                        padding: '14px 20px',
                                        backgroundColor: '#ADD8E6',
                                        borderBottom: '1px solid #e5e7eb',
                                        color: 'black',
                                        textAlign: 'center',
                                        fontSize: '16px',
                                        fontWeight: 'bold'
                                    }}
                                >
                                    Location
                                </th>

                                <th
                                    style={{
                                        width: '20%',
                                        padding: '14px 20px',
                                       backgroundColor: '#ADD8E6',
                                        borderBottom: '1px solid #e5e7eb',
                                        color: 'black',
                                        textAlign: 'center',
                                        fontSize: '16px',
                                        fontWeight: 'bold'
                                    }}
                                >
                                    Actions
                                </th>

                            </tr>

                        </thead>


                        <tbody>

                            {bases.length === 0 ? (

                                <tr>

                                    <td
                                        colSpan="4"
                                        style={{
                                            padding: '45px 20px',
                                            textAlign: 'center',
                                            color: '#9ca3af',
                                            fontSize: '16px'
                                        }}
                                    >
                                        No bases registered yet
                                    </td>

                                </tr>

                            ) : (

                                bases.map((base) => (

                                    <tr key={base.id}>

                                        <td
                                            style={{
                                                padding: '17px 20px',
                                                borderBottom: '1px solid #f1f5f9',
                                                color: 'black',
                                                fontSize: '16px',
                                                textAlign: 'center',
                                            }}
                                        >
                                            {base.id}
                                        </td>


                                        <td
                                            style={{
                                                padding: '17px 20px',
                                                borderBottom: '1px solid #f1f5f9',
                                                color: 'black',
                                                fontSize: '16px',
                                                fontWeight: '500',
                                                textAlign: 'center',
                                            }}
                                        >
                                            {base.name}
                                        </td>


                                        <td
                                            style={{
                                                padding: '17px 20px',
                                                borderBottom: '1px solid #f1f5f9',
                                                 color: 'black',
                                                fontSize: '16px',
                                                textAlign: 'center',
                                            }}
                                        >
                                            {base.location}
                                        </td>


                                        <td
                                            style={{
                                                padding: '17px 20px',
                                                borderBottom: '1px solid #f1f5f9'
                                            }}
                                        >

                                            <div
                                                style={{
                                                    display: 'flex',
                                                    gap: '8px'
                                                }}
                                            >

                                                <button
                                                    onClick={() =>
                                                        handleEdit(base)
                                                    }
                                                    style={{
                                                        height: '32px',
                                                        padding: '0 15px',
                                                        border: '2px solid white',
                                                        borderRadius: '5px',
                                                        backgroundColor: 'yellow',
                                                        color: 'black',
                                                        fontSize: '15px',
                                                        cursor: 'pointer',
                                                        marginRight: '35px',
                                                    }}
                                                >
                                                    Edit
                                                </button>


                                                <button
                                                    onClick={() =>
                                                        handleDelete(base.id)
                                                    }
                                                    style={{
                                                        height: '32px',
                                                        padding: '0 15px',
                                                        border: '2px solid #fecaca',
                                                        borderRadius: '5px',
                                                        backgroundColor: 'red',
                                                        color: 'white',
                                                        fontSize: '15px',
                                                        cursor: 'pointer',
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

export default Bases;