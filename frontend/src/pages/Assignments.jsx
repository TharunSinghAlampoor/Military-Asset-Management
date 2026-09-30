import { useEffect, useState } from 'react';
import api from '../services/api';
import Navbar from '../components/Navbar';

function Assignments() {

    const [assignments, setAssignments] = useState([]);
    const [bases, setBases] = useState([]);
    const [assetTypes, setAssetTypes] = useState([]);

    const [baseId, setBaseId] = useState('');
    const [assetTypeId, setAssetTypeId] = useState('');
    const [personName, setPersonName] = useState('');
    const [quantity, setQuantity] = useState('');
    const [assignedDate, setAssignedDate] = useState('');

    const [editingId, setEditingId] = useState(null);
    const [showForm, setShowForm] = useState(false);


    const getAssignments = async () => {

        try {

            const response =
                await api.get('/api/assignments');

            setAssignments(response.data);

        } catch (error) {

            console.error(
                'Assignments error:',
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


    const getAssetTypes = async () => {

        try {

            const response =
                await api.get('/api/asset-types');

            setAssetTypes(response.data);

        } catch (error) {

            console.error(
                'Asset types error:',
                error
            );

        }

    };


    useEffect(() => {

        getAssignments();
        getBases();
        getAssetTypes();

    }, []);


    const handleSubmit = async (e) => {

        e.preventDefault();

        try {

            const assignmentData = {

                baseId: Number(baseId),

                assetTypeId: Number(assetTypeId),

                personName: personName,

                quantity: Number(quantity),

                assignedDate: assignedDate

            };


            if (editingId) {

                await api.put(
                    `/api/assignments/${editingId}`,
                    assignmentData
                );

                alert(
                    'Assignment updated successfully'
                );

            } else {

                await api.post(
                    '/api/assignments',
                    assignmentData
                );

                alert(
                    'Assignment created successfully'
                );

            }


            resetForm();

            getAssignments();

        } catch (error) {

            console.error(
                'Save assignment error:',
                error
            );

            alert(
                error.response?.data ||
                'Failed to save assignment'
            );

        }

    };


    const handleEdit = (assignment) => {

        setEditingId(assignment.id);

        setBaseId(assignment.baseId);

        setAssetTypeId(assignment.assetTypeId);

        setPersonName(assignment.personName);

        setQuantity(assignment.quantity);

        setAssignedDate(
            assignment.assignedDate
        );

        setShowForm(true);

    };


    const handleDelete = async (id) => {

        const confirmDelete = window.confirm(
            'Are you sure you want to delete this assignment?'
        );

        if (!confirmDelete) {
            return;
        }


        try {

            await api.delete(
                `/api/assignments/${id}`
            );

            alert(
                'Assignment deleted successfully'
            );

            getAssignments();

        } catch (error) {

            console.error(
                'Delete assignment error:',
                error
            );

            alert(
                error.response?.data ||
                'Failed to delete assignment'
            );

        }

    };


    const resetForm = () => {

        setEditingId(null);

        setBaseId('');

        setAssetTypeId('');

        setPersonName('');

        setQuantity('');

        setAssignedDate('');

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
                            Assignments
                        </h1>

                        <p
                            style={{
                                margin: '7px 0 0',
                                fontSize: '14px',
                                color: '#6b7280'
                            }}
                        >
                            Manage assets assigned to personnel
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
                            Add Assignment
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
                                    ? 'Edit Assignment'
                                    : 'Add New Assignment'}
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

                            {/* BASE */}

                            <div>

                                <label
                                    style={{
                                        display: 'block',
                                        marginBottom: '7px',
                                        marginBottom: '7px',
                                        fontSize: '16px',
                                        fontWeight: 'bold',
                                        color: 'black'
                                    }}
                                >
                                    Base
                                </label>

                                <select
                                    value={baseId}
                                    onChange={(e) =>
                                        setBaseId(e.target.value)
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
                                        color: 'black',
                                        backgroundColor: 'white'
                                    }}
                                >

                                    <option value="">
                                        Select Base
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


                            {/* ASSET TYPE */}

                            <div>

                                <label
                                    style={{
                                        marginBottom: '7px',
                                        display: 'block',
                                        marginBottom: '7px',
                                        fontSize: '16px',
                                        fontWeight: 'bold',
                                        color: 'black'
                                    }}
                                >
                                    Asset Type
                                </label>

                                <select
                                    value={assetTypeId}
                                    onChange={(e) =>
                                        setAssetTypeId(
                                            e.target.value
                                        )
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
                                        color: 'black',
                                        backgroundColor: 'white'
                                    }}
                                >

                                    <option value="">
                                        Select Asset Type
                                    </option>

                                    {assetTypes.map(
                                        (assetType) => (

                                            <option
                                                key={assetType.id}
                                                value={assetType.id}
                                            >
                                                {assetType.name}
                                            </option>

                                        )
                                    )}

                                </select>

                            </div>


                            {/* PERSON NAME */}

                            <div>

                                <label
                                    style={{
                                        display: 'block',
                                        marginBottom: '7px',
                                        fontSize: '16px',
                                        fontWeight: 'bold',
                                        color: 'black'
                                    }}
                                >
                                    Person Name
                                </label>

                                <input
                                    type="text"
                                    placeholder="Enter person name"
                                    value={personName}
                                    onChange={(e) =>
                                        setPersonName(
                                            e.target.value
                                        )
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
                                        color: 'black',
                                        boxSizing: 'border-box'
                                    }}
                                />

                            </div>


                            {/* QUANTITY */}

                            <div>

                                <label
                                    style={{
                                        display: 'block',
                                        marginBottom: '7px',
                                        fontSize: '16px',
                                        fontWeight: 'bold',
                                        color: 'black'
                                    }}
                                >
                                    Quantity
                                </label>

                                <input
                                    type="number"
                                    min="1"
                                    placeholder="Enter quantity"
                                    value={quantity}
                                    onChange={(e) =>
                                        setQuantity(
                                            e.target.value
                                        )
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
                                        color: 'black',
                                        boxSizing: 'border-box'
                                    }}
                                />

                            </div>


                            {/* ASSIGNED DATE */}

                            <div>

                                <label
                                    style={{
                                        display: 'block',
                                        marginBottom: '7px',
                                        fontSize: '16px',
                                        fontWeight: 'bold',
                                        color: 'black'
                                    }}
                                >
                                    Assigned Date
                                </label>

                                <input
                                    type="date"
                                    value={assignedDate}
                                    onChange={(e) =>
                                        setAssignedDate(
                                            e.target.value
                                        )
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
                                        color: 'black',
                                        boxSizing: 'border-box'
                                    }}
                                />

                            </div>


                            {/* BUTTONS */}

                            <div
                                style={{
                                    display: 'flex',
                                    alignItems: 'flex-end',
                                    gap: '10px'
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
                                        ? 'Update Assignment'
                                        : 'Save Assignment'}
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
                        Assignment Records
                    </h2>

                    <p
                        style={{
                            margin: '4px 0 0',
                            fontSize: '13px',
                            color: '#9ca3af'
                        }}
                    >
                        {assignments.length} assignment
                        {assignments.length !== 1
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

                                <th
                                    style={{
                                        backgroundColor: '#ADD8E6',
                                        padding: '14px 18px',
                                        borderBottom: '1px solid #e5e7eb',
                                        color: 'bold',
                                        textAlign: 'center',
                                        fontSize: '16px',
                                        fontWeight: 'bold'
                                    }}
                                >
                                    ID
                                </th>

                                <th
                                    style={{
                                       padding: '14px 18px',
                                        backgroundColor: '#ADD8E6',
                                        borderBottom: '1px solid #e5e7eb',
                                        color: 'bold',
                                        textAlign: 'center',
                                        fontSize: '16px',
                                        fontWeight: 'bold'
                                    }}
                                >
                                    Base ID
                                </th>

                                <th
                                    style={{
                                        padding: '14px 18px',
                                        backgroundColor: '#ADD8E6',
                                        borderBottom: '1px solid #e5e7eb',
                                        color: 'bold',
                                        textAlign: 'center',
                                        fontSize: '16px',
                                        fontWeight: 'bold'
                                    }}
                                >
                                    Asset Type ID
                                </th>

                                <th
                                    style={{
                                       padding: '14px 18px',
                                        backgroundColor: '#ADD8E6',
                                        borderBottom: '1px solid #e5e7eb',
                                        color: 'bold',
                                        textAlign: 'center',
                                        fontSize: '16px',
                                        fontWeight: 'bold'
                                    }}
                                >
                                    Person Name
                                </th>

                                <th
                                    style={{
                                        padding: '14px 18px',
                                        backgroundColor: '#ADD8E6',
                                        borderBottom: '1px solid #e5e7eb',
                                        color: 'bold',
                                        textAlign: 'center',
                                        fontSize: '16px',
                                        fontWeight: 'bold'
                                    }}
                                >
                                    Quantity
                                </th>

                                <th
                                    style={{
                                        padding: '14px 18px',
                                        backgroundColor: '#ADD8E6',
                                        borderBottom: '1px solid #e5e7eb',
                                        color: 'bold',
                                        textAlign: 'center',
                                        fontSize: '16px',
                                        fontWeight: 'bold'
                                    }}
                                >
                                    Assigned Date
                                </th>

                                <th
                                    style={{
                                       padding: '14px 18px',
                                        backgroundColor: '#ADD8E6',
                                        borderBottom: '1px solid #e5e7eb',
                                        color: 'bold',
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

                            {assignments.length === 0 ? (

                                <tr>

                                    <td
                                        colSpan="7"
                                        style={{
                                            padding: '45px 20px',
                                            textAlign: 'center',
                                            color: 'black',
                                            fontSize: '14px'
                                        }}
                                    >
                                        No assignment records found
                                    </td>

                                </tr>

                            ) : (

                                assignments.map(
                                    (assignment) => (

                                        <tr
                                            key={assignment.id}
                                        >

                                            <td
                                                style={{
                                                    padding: '17px 18px',
                                                    borderBottom: '1px solid #f1f5f9',
                                                    color: 'black',
                                                    fontSize: '14px'
                                                }}
                                            >
                                                {assignment.id}
                                            </td>


                                            <td
                                                style={{
                                                    padding: '17px 18px',
                                                    borderBottom: '1px solid #f1f5f9',
                                                   color: 'black',
                                                    fontSize: '14px'
                                                }}
                                            >
                                                {assignment.baseId}
                                            </td>


                                            <td
                                                style={{
                                                    padding: '17px 18px',
                                                    borderBottom: '1px solid #f1f5f9',
                                                    color: 'black',
                                                    fontSize: '14px'
                                                }}
                                            >
                                                {assignment.assetTypeId}
                                            </td>


                                            <td
                                                style={{
                                                    padding: '17px 18px',
                                                    borderBottom: '1px solid #f1f5f9',
                                                    color: 'black',
                                                    fontSize: '14px',
                                                    fontWeight: '500'
                                                }}
                                            >
                                                {assignment.personName}
                                            </td>


                                            <td
                                                style={{
                                                    padding: '17px 18px',
                                                    borderBottom: '1px solid #f1f5f9',
                                                    color: '#172554',
                                                    fontSize: '14px',
                                                    fontWeight: '600'
                                                }}
                                            >
                                                {assignment.quantity}
                                            </td>


                                            <td
                                                style={{
                                                    padding: '17px 18px',
                                                    borderBottom: '1px solid #f1f5f9',
                                                    color: '#64748b',
                                                    fontSize: '14px'
                                                }}
                                            >
                                                {assignment.assignedDate}
                                            </td>


                                            <td
                                                style={{
                                                    padding: '17px 18px',
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
                                                            handleEdit(
                                                                assignment
                                                            )
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
                                                                assignment.id
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

                                    )
                                )

                            )}

                        </tbody>

                    </table>

                </div>

            </main>

        </div>
    );
}

export default Assignments;