import { useEffect, useState } from 'react';
import api from '../services/api';
import Navbar from '../components/Navbar';

function Expenditures() {

    const [expenditures, setExpenditures] = useState([]);
    const [bases, setBases] = useState([]);
    const [assetTypes, setAssetTypes] = useState([]);

    const [baseId, setBaseId] = useState('');
    const [assetTypeId, setAssetTypeId] = useState('');
    const [quantity, setQuantity] = useState('');
    const [reason, setReason] = useState('');
    const [expendedDate, setExpendedDate] = useState('');

    const [editingId, setEditingId] = useState(null);
    const [showForm, setShowForm] = useState(false);


    const getExpenditures = async () => {

        try {

            const response =
                await api.get('/api/expenditures');

            setExpenditures(response.data);

        } catch (error) {

            console.error(
                'Expenditures error:',
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

        getExpenditures();
        getBases();
        getAssetTypes();

    }, []);


    const handleSubmit = async (e) => {

        e.preventDefault();

        try {

            const expenditureData = {

                baseId: Number(baseId),

                assetTypeId: Number(assetTypeId),

                quantity: Number(quantity),

                reason: reason,

                expendedDate: expendedDate

            };


            if (editingId) {

                await api.put(
                    `/api/expenditures/${editingId}`,
                    expenditureData
                );

                alert(
                    'Expenditure updated successfully'
                );

            } else {

                await api.post(
                    '/api/expenditures',
                    expenditureData
                );

                alert(
                    'Expenditure created successfully'
                );

            }


            resetForm();

            getExpenditures();

        } catch (error) {

            console.error(
                'Save expenditure error:',
                error
            );

            alert(
                error.response?.data ||
                'Failed to save expenditure'
            );

        }

    };


    const handleEdit = (expenditure) => {

        setEditingId(expenditure.id);

        setBaseId(expenditure.baseId);

        setAssetTypeId(expenditure.assetTypeId);

        setQuantity(expenditure.quantity);

        setReason(expenditure.reason || '');

        setExpendedDate(
            expenditure.expendedDate
        );

        setShowForm(true);

    };


    const handleDelete = async (id) => {

        const confirmDelete = window.confirm(
            'Are you sure you want to delete this expenditure?'
        );

        if (!confirmDelete) {
            return;
        }


        try {

            await api.delete(
                `/api/expenditures/${id}`
            );

            alert(
                'Expenditure deleted successfully'
            );

            getExpenditures();

        } catch (error) {

            console.error(
                'Delete expenditure error:',
                error
            );

            alert(
                error.response?.data ||
                'Failed to delete expenditure'
            );

        }

    };


    const resetForm = () => {

        setEditingId(null);

        setBaseId('');

        setAssetTypeId('');

        setQuantity('');

        setReason('');

        setExpendedDate('');

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
                            Expenditures
                        </h1>

                        <p
                            style={{
                                margin: '7px 0 0',
                                fontSize: '14px',
                                color: '#6b7280'
                            }}
                        >
                            Manage assets consumed or expended from inventory
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
                            Add Expenditure
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
                                    ? 'Edit Expenditure'
                                    : 'Add New Expenditure'}
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
                                        fontSize: '13px',
                                        fontWeight: '500',
                                        color: '#374151'
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
                                        color: '#1f2937',
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
                                        display: 'block',
                                        marginBottom: '7px',
                                        fontSize: '13px',
                                        fontWeight: '500',
                                        color: '#374151'
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
                                        color: '#1f2937',
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


                            {/* QUANTITY */}

                            <div>

                                <label
                                    style={{
                                        display: 'block',
                                        marginBottom: '7px',
                                        fontSize: '13px',
                                        fontWeight: '500',
                                        color: '#374151'
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
                                        color: '#1f2937',
                                        boxSizing: 'border-box'
                                    }}
                                />

                            </div>


                            {/* REASON */}

                            <div>

                                <label
                                    style={{
                                        display: 'block',
                                        marginBottom: '7px',
                                        fontSize: '13px',
                                        fontWeight: '500',
                                        color: '#374151'
                                    }}
                                >
                                    Reason
                                </label>

                                <input
                                    type="text"
                                    placeholder="Enter reason"
                                    value={reason}
                                    onChange={(e) =>
                                        setReason(
                                            e.target.value
                                        )
                                    }
                                    style={{
                                        width: '100%',
                                        height: '42px',
                                        padding: '0 12px',
                                        border: '1px solid #d1d5db',
                                        borderRadius: '6px',
                                        outline: 'none',
                                        fontSize: '14px',
                                        color: '#1f2937',
                                        boxSizing: 'border-box'
                                    }}
                                />

                            </div>


                            {/* EXPENDED DATE */}

                            <div>

                                <label
                                    style={{
                                        display: 'block',
                                        marginBottom: '7px',
                                        fontSize: '13px',
                                        fontWeight: '500',
                                        color: '#374151'
                                    }}
                                >
                                    Expended Date
                                </label>

                                <input
                                    type="date"
                                    value={expendedDate}
                                    onChange={(e) =>
                                        setExpendedDate(
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
                                        color: '#1f2937',
                                        boxSizing: 'border-box'
                                    }}
                                />

                            </div>


                            {/* SAVE BUTTON */}

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
                                        ? 'Update Expenditure'
                                        : 'Save Expenditure'}
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
                        Expenditure Records
                    </h2>

                    <p
                        style={{
                            margin: '4px 0 0',
                            fontSize: '13px',
                            color: '#9ca3af'
                        }}
                    >
                        {expenditures.length} expenditure
                        {expenditures.length !== 1
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
                            minWidth: '1000px'
                        }}
                    >

                        <thead>

                            <tr>

                                <th style={headerStyle}>
                                    ID
                                </th>

                                <th style={headerStyle}>
                                    Base ID
                                </th>

                                <th style={headerStyle}>
                                    Asset Type ID
                                </th>

                                <th style={headerStyle}>
                                    Quantity
                                </th>

                                <th style={headerStyle}>
                                    Reason
                                </th>

                                <th style={headerStyle}>
                                    Expended Date
                                </th>

                                <th style={headerStyle}>
                                    Actions
                                </th>

                            </tr>

                        </thead>


                        <tbody>

                            {expenditures.length === 0 ? (

                                <tr>

                                    <td
                                        colSpan="7"
                                        style={{
                                            padding: '45px 20px',
                                            textAlign: 'center',
                                            color: '#9ca3af',
                                            fontSize: '14px'
                                        }}
                                    >
                                        No expenditure records found
                                    </td>

                                </tr>

                            ) : (

                                expenditures.map(
                                    (expenditure) => (

                                        <tr
                                            key={expenditure.id}
                                        >

                                            <td style={cellStyle}>
                                                {expenditure.id}
                                            </td>

                                            <td style={cellStyle}>
                                                {expenditure.baseId}
                                            </td>

                                            <td style={cellStyle}>
                                                {expenditure.assetTypeId}
                                            </td>

                                            <td
                                                style={{
                                                    ...cellStyle,
                                                    color: '#172554',
                                                    fontWeight: '600'
                                                }}
                                            >
                                                {expenditure.quantity}
                                            </td>

                                            <td
                                                style={{
                                                    ...cellStyle,
                                                    color: '#374151'
                                                }}
                                            >
                                                {expenditure.reason || '-'}
                                            </td>

                                            <td style={cellStyle}>
                                                {expenditure.expendedDate}
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
                                                            handleEdit(
                                                                expenditure
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
                                                                expenditure.id
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


export default Expenditures;