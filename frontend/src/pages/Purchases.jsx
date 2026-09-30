import { useEffect, useState } from 'react';
import api from '../services/api';
import Navbar from '../components/Navbar';

function Purchases() {

    const [purchases, setPurchases] = useState([]);
    const [bases, setBases] = useState([]);
    const [assetTypes, setAssetTypes] = useState([]);

    const [baseId, setBaseId] = useState('');
    const [assetTypeId, setAssetTypeId] = useState('');
    const [quantity, setQuantity] = useState('');
    const [purchaseDate, setPurchaseDate] = useState('');
    const [referenceNumber, setReferenceNumber] = useState('');

    const [editingId, setEditingId] = useState(null);
    const [showForm, setShowForm] = useState(false);


    const getPurchases = async () => {

        try {

            const response = await api.get('/api/purchases');

            setPurchases(response.data);

        } catch (error) {

            console.error(
                'Purchases error:',
                error
            );

        }

    };


    const getBases = async () => {

        try {

            const response = await api.get('/api/bases');

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

        getPurchases();
        getBases();
        getAssetTypes();

    }, []);


    const handleSubmit = async (e) => {

        e.preventDefault();

        try {

            const purchaseData = {
                baseId: Number(baseId),
                assetTypeId: Number(assetTypeId),
                quantity: Number(quantity),
                purchaseDate: purchaseDate,
                referenceNumber: referenceNumber
            };


            if (editingId) {

                await api.put(
                    `/api/purchases/${editingId}`,
                    purchaseData
                );

                alert(
                    'Purchase updated successfully'
                );

            } else {

                await api.post(
                    '/api/purchases',
                    purchaseData
                );

                alert(
                    'Purchase created successfully'
                );

            }


            resetForm();

            getPurchases();

        } catch (error) {

            console.error(
                'Save purchase error:',
                error
            );

            alert(
                error.response?.data ||
                'Failed to save purchase'
            );

        }

    };


    const handleEdit = (purchase) => {

        setEditingId(purchase.id);

        setBaseId(purchase.baseId);

        setAssetTypeId(purchase.assetTypeId);

        setQuantity(purchase.quantity);

        setPurchaseDate(
            purchase.purchaseDate
        );

        setReferenceNumber(
            purchase.referenceNumber || ''
        );

        setShowForm(true);

    };


    const handleDelete = async (id) => {

        const confirmDelete = window.confirm(
            'Are you sure you want to delete this purchase?'
        );

        if (!confirmDelete) {
            return;
        }


        try {

            await api.delete(
                `/api/purchases/${id}`
            );

            alert(
                'Purchase deleted successfully'
            );

            getPurchases();

        } catch (error) {

            console.error(
                'Delete purchase error:',
                error
            );

            alert(
                error.response?.data ||
                'Failed to delete purchase'
            );

        }

    };


    const resetForm = () => {

        setEditingId(null);

        setBaseId('');

        setAssetTypeId('');

        setQuantity('');

        setPurchaseDate('');

        setReferenceNumber('');

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
                                color: 'black'
                            }}
                        >
                            Purchases
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
                                backgroundColor: 'green',
                                color: 'white',
                                fontWeight: 'bold',
                                fontSize: '14px',
                                fontWeight: '500',
                                cursor: 'pointer'
                            }}
                        >
                            Add Purchase
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
                                    ? 'Edit Purchase'
                                    : 'Add New Purchase'}
                            </h2>


                            <button
                                type="button"
                                onClick={resetForm}
                                style={{
                                    border: 'none',
                                    background: 'transparent',
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
                                        color: '#1f2937',
                                        boxSizing: 'border-box'
                                    }}
                                />

                            </div>


                            {/* PURCHASE DATE */}

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
                                    Purchase Date
                                </label>

                                <input
                                    type="date"
                                    value={purchaseDate}
                                    onChange={(e) =>
                                        setPurchaseDate(
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


                            {/* REFERENCE NUMBER */}

                            <div>

                                <label
                                    style={{
                                        display: 'block',
                                        marginBottom: '7px',
                                        fontSize: '16px',
                                        color: 'black',
                                        fontWeight: 'bold'
                                    }}
                                >
                                    Reference Number
                                </label>

                                <input
                                    type="text"
                                    placeholder="Enter reference number"
                                    value={referenceNumber}
                                    onChange={(e) =>
                                        setReferenceNumber(
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
                                        ? 'Update Purchase'
                                        : 'Save Purchase'}
                                </button>

                            </div>

                        </form>

                    </div>

                )}


                {/* LIST HEADER */}

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
                                color: '#1f2937'
                            }}
                        >
                            Purchase Records
                        </h2>

                        <p
                            style={{
                                margin: '4px 0 0',
                                fontSize: '13px',
                                color: '#9ca3af'
                            }}
                        >
                            {purchases.length} purchase
                            {purchases.length !== 1
                                ? 's'
                                : ''} registered
                        </p>

                    </div>

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

                                <th
                                    style={{
                                        padding: '14px 18px',
                                        
                                        borderBottom: '1px solid #e5e7eb',
                                        color: 'black',
                                        textAlign: 'center',
                                        fontSize: '16px',
                                        fontWeight: 'bold',
                                         backgroundColor: '#ADD8E6',
                                    }}
                                >
                                    ID
                                </th>

                                <th
                                    style={{
                                        padding: '14px 18px',
                                        
                                        borderBottom: '1px solid #e5e7eb',
                                        color: 'black',
                                         backgroundColor: '#ADD8E6',
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
                                        borderBottom: '1px solid #e5e7eb',
                                        color: 'black',
                                         backgroundColor: '#ADD8E6',
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
                                        color: 'black',
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
                                       color: 'black',
                                        textAlign: 'center',
                                        fontSize: '16px',
                                        fontWeight: 'bold'
                                    }}
                                >
                                    Purchase Date
                                </th>

                                <th
                                    style={{
                                        padding: '14px 18px',
                                         backgroundColor: '#ADD8E6',
                                        borderBottom: '1px solid #e5e7eb',
                                        color: 'black',
                                        textAlign: 'center',
                                        fontSize: '16px',
                                        fontWeight: 'bold'
                                    }}
                                >
                                    Reference
                                </th>

                                <th
                                    style={{
                                        padding: '14px 18px',
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

                            {purchases.length === 0 ? (

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
                                        No purchase records found
                                    </td>

                                </tr>

                            ) : (

                                purchases.map((purchase) => (

                                    <tr key={purchase.id}>

                                        <td
                                            style={{
                                                padding: '17px 18px',
                                                borderBottom: '1px solid #f1f5f9',
                                                color: 'black',
                                                fontSize: '14px',
                                                textAlign: 'center'
                                            }}
                                        >
                                            {purchase.id}
                                        </td>


                                        <td
                                            style={{
                                                padding: '17px 18px',
                                                borderBottom: '1px solid #f1f5f9',
                                                color: 'black',
                                                fontSize: '14px',
                                                textAlign: 'center'
                                            }}
                                        >
                                            {purchase.baseId}
                                        </td>


                                        <td
                                            style={{
                                                padding: '17px 18px',
                                                borderBottom: '1px solid #f1f5f9',
                                                color: 'black',
                                                fontSize: '14px',
                                                textAlign: 'center'
                                            }}
                                        >
                                            {purchase.assetTypeId}
                                        </td>


                                        <td
                                            style={{
                                                padding: '17px 18px',
                                                borderBottom: '1px solid #f1f5f9',
                                                color: 'black',
                                                fontSize: '14px',
                                                fontWeight: 'bold',
                                                textAlign: 'center'
                                            }}
                                        >
                                            {purchase.quantity}
                                        </td>


                                        <td
                                            style={{
                                                padding: '17px 18px',
                                                borderBottom: '1px solid #f1f5f9',
                                                color: 'black',
                                                fontSize: '14px',
                                                fontWeight: 'bold',
                                                textAlign: 'center'
                                            }}
                                        >
                                            {purchase.purchaseDate}
                                        </td>


                                        <td
                                            style={{
                                                padding: '17px 18px',
                                                borderBottom: '1px solid #f1f5f9',
                                               color: 'black',
                                                fontSize: '14px',
                                                fontWeight: 'bold',
                                                textAlign: 'center'
                                            }}
                                        >
                                            {purchase.referenceNumber ||
                                                '-'}
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
                                                            purchase
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
                                                            purchase.id
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

export default Purchases;