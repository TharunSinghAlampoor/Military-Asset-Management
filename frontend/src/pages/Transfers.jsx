import { useEffect, useState } from 'react';
import api from '../services/api';
import Navbar from '../components/Navbar';

function Transfers() {

    const [transfers, setTransfers] = useState([]);
    const [bases, setBases] = useState([]);
    const [assetTypes, setAssetTypes] = useState([]);
    const [inventory, setInventory] = useState([]);

    const [fromBaseId, setFromBaseId] = useState('');
    const [toBaseId, setToBaseId] = useState('');
    const [assetTypeId, setAssetTypeId] = useState('');
    const [quantity, setQuantity] = useState('');
    const [transferDate, setTransferDate] = useState('');
    const [status, setStatus] = useState('COMPLETED');

    const [editingId, setEditingId] = useState(null);
    const [showForm, setShowForm] = useState(false);

    // =========================================================
    // GET TRANSFERS
    // =========================================================

    const getTransfers = async () => {

        try {

            const response =
                await api.get('/api/transfers');

            setTransfers(response.data);

        } catch (error) {

            console.error(
                'Transfers error:',
                error
            );

        }
    };

    // =========================================================
    // GET BASES
    // =========================================================

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

    // =========================================================
    // GET ASSET TYPES
    // =========================================================

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

    // =========================================================
    // GET INVENTORY
    // =========================================================

    const getInventory = async () => {

        try {

            const response =
                await api.get('/api/inventory');

            setInventory(response.data);

        } catch (error) {

            console.error(
                'Inventory error:',
                error
            );

        }
    };

    // =========================================================
    // LOAD DATA
    // =========================================================

    useEffect(() => {

        getTransfers();
        getBases();
        getAssetTypes();
        getInventory();

    }, []);

    // =========================================================
    // GET AVAILABLE INVENTORY FOR SELECTED SOURCE BASE
    // =========================================================

    const availableInventory =
        inventory.filter(
            (item) =>
                Number(item.baseId) ===
                Number(fromBaseId) &&
                Number(item.quantity) > 0
        );

    // =========================================================
    // GET ASSET TYPES AVAILABLE IN SOURCE BASE
    // =========================================================

    const availableAssetTypes =
        assetTypes.filter((assetType) =>
            availableInventory.some(
                (item) =>
                    Number(item.assetTypeId) ===
                    Number(assetType.id)
            )
        );

    // =========================================================
    // GET SELECTED ASSET AVAILABLE QUANTITY
    // =========================================================

    const selectedInventory =
        inventory.find(
            (item) =>
                Number(item.baseId) ===
                    Number(fromBaseId) &&
                Number(item.assetTypeId) ===
                    Number(assetTypeId)
        );

    const availableQuantity =
        selectedInventory
            ? Number(selectedInventory.quantity)
            : 0;

    // =========================================================
    // WHEN FROM BASE CHANGES
    // =========================================================

    const handleFromBaseChange = (e) => {

        const selectedBase =
            e.target.value;

        setFromBaseId(selectedBase);

        // Reset asset because available
        // assets depend on source base
        setAssetTypeId('');

        setQuantity('');
    };

    // =========================================================
    // WHEN ASSET TYPE CHANGES
    // =========================================================

    const handleAssetTypeChange = (e) => {

        const selectedAsset =
            e.target.value;

        setAssetTypeId(selectedAsset);

        setQuantity('');
    };

    // =========================================================
    // SUBMIT TRANSFER
    // =========================================================

    const handleSubmit = async (e) => {

        e.preventDefault();

        // -----------------------------------------------------
        // CHECK SOURCE AND DESTINATION
        // -----------------------------------------------------

        if (!fromBaseId || !toBaseId) {

            alert(
                'Please select both From Base and To Base.'
            );

            return;
        }

        // -----------------------------------------------------
        // SAME BASE CHECK
        // -----------------------------------------------------

        if (
            Number(fromBaseId) ===
            Number(toBaseId)
        ) {

            alert(
                'From Base and To Base cannot be the same.'
            );

            return;
        }

        // -----------------------------------------------------
        // ASSET CHECK
        // -----------------------------------------------------

        if (!assetTypeId) {

            alert(
                'Please select an Asset Type.'
            );

            return;
        }

        // -----------------------------------------------------
        // QUANTITY CHECK
        // -----------------------------------------------------

        const transferQuantity =
            Number(quantity);

        if (
            !transferQuantity ||
            transferQuantity <= 0
        ) {

            alert(
                'Quantity must be greater than zero.'
            );

            return;
        }

        // -----------------------------------------------------
        // AVAILABLE QUANTITY CHECK
        // -----------------------------------------------------

        if (
            transferQuantity >
            availableQuantity
        ) {

            alert(
                `Only ${availableQuantity} units are available in the selected source base.`
            );

            return;
        }

        // -----------------------------------------------------
        // TRANSFER DATA
        // -----------------------------------------------------

        try {

            const transferData = {

                fromBaseId:
                    Number(fromBaseId),

                toBaseId:
                    Number(toBaseId),

                assetTypeId:
                    Number(assetTypeId),

                quantity:
                    transferQuantity,

                transferDate:
                    transferDate,

                status:
                    status
            };

            // -------------------------------------------------
            // UPDATE
            // -------------------------------------------------

            if (editingId) {

                await api.put(
                    `/api/transfers/${editingId}`,
                    transferData
                );

                alert(
                    'Transfer updated successfully'
                );

            }

            // -------------------------------------------------
            // CREATE
            // -------------------------------------------------

            else {

                await api.post(
                    '/api/transfers',
                    transferData
                );

                alert(
                    'Transfer created successfully'
                );
            }

            // -------------------------------------------------
            // RESET
            // -------------------------------------------------

            resetForm();

            // Refresh transfer list
            getTransfers();

            // Refresh inventory
            getInventory();

        } catch (error) {

            console.error(
                'Save transfer error:',
                error
            );

            console.error(
                'Backend response:',
                error.response?.data
            );

            alert(
                error.response?.data ||
                error.response?.data?.message ||
                'Failed to save transfer'
            );
        }
    };

    // =========================================================
    // EDIT
    // =========================================================

    const handleEdit = (transfer) => {

        setEditingId(
            transfer.id
        );

        setFromBaseId(
            transfer.fromBaseId
        );

        setToBaseId(
            transfer.toBaseId
        );

        setAssetTypeId(
            transfer.assetTypeId
        );

        setQuantity(
            transfer.quantity
        );

        setTransferDate(
            transfer.transferDate
        );

        setStatus(
            transfer.status ||
            'COMPLETED'
        );

        setShowForm(true);
    };

    // =========================================================
    // DELETE
    // =========================================================

    const handleDelete = async (id) => {

        const confirmDelete =
            window.confirm(
                'Are you sure you want to delete this transfer?'
            );

        if (!confirmDelete) {

            return;
        }

        try {

            await api.delete(
                `/api/transfers/${id}`
            );

            alert(
                'Transfer deleted successfully'
            );

            getTransfers();

            getInventory();

        } catch (error) {

            console.error(
                'Delete transfer error:',
                error
            );

            alert(
                error.response?.data ||
                'Failed to delete transfer'
            );
        }
    };

    // =========================================================
    // RESET FORM
    // =========================================================

    const resetForm = () => {

        setEditingId(null);

        setFromBaseId('');

        setToBaseId('');

        setAssetTypeId('');

        setQuantity('');

        setTransferDate('');

        setStatus('COMPLETED');

        setShowForm(false);
    };

    // =========================================================
    // OPEN ADD FORM
    // =========================================================

    const openAddForm = () => {

        resetForm();

        setShowForm(true);
    };

    // =========================================================
    // RENDER
    // =========================================================

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

                {/* =================================================
                    HEADER
                ================================================= */}

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
                            Transfers
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
                                backgroundColor: '#172554',
                                color: 'white',
                                fontSize: '14px',
                                fontWeight: '500',
                                cursor: 'pointer'
                            }}
                        >
                            Add Transfer
                        </button>

                    )}

                </div>

                {/* =================================================
                    FORM
                ================================================= */}

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
                                    color: 'black'
                                }}
                            >
                                {editingId
                                    ? 'Edit Transfer'
                                    : 'Add New Transfer'}
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

                            {/* =================================================
                                FROM BASE
                            ================================================= */}

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
                                    From Base
                                </label>

                                <select
                                    value={fromBaseId}
                                    onChange={
                                        handleFromBaseChange
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
                                        Select From Base
                                    </option>

                                    {bases.map(
                                        (base) => (

                                            <option
                                                key={base.id}
                                                value={base.id}
                                            >
                                                {base.name}
                                            </option>

                                        )
                                    )}

                                </select>

                            </div>

                            {/* =================================================
                                TO BASE
                            ================================================= */}

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
                                    To Base
                                </label>

                                <select
                                    value={toBaseId}
                                    onChange={(e) =>
                                        setToBaseId(
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
                                        Select To Base
                                    </option>

                                    {bases.map(
                                        (base) => (

                                            <option
                                                key={base.id}
                                                value={base.id}
                                            >
                                                {base.name}
                                            </option>

                                        )
                                    )}

                                </select>

                            </div>

                            {/* =================================================
                                ASSET TYPE
                            ================================================= */}

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
                                    onChange={
                                        handleAssetTypeChange
                                    }
                                    required
                                    disabled={!fromBaseId}
                                    style={{
                                        width: '100%',
                                        height: '42px',
                                        padding: '0 12px',
                                        border: '1px solid #d1d5db',
                                        borderRadius: '6px',
                                        outline: 'none',
                                        fontSize: '14px',
                                        color: 'black',
                                        backgroundColor:
                                            fromBaseId
                                                ? 'white'
                                                : '#f3f4f6'
                                    }}
                                >

                                    <option value="">
                                        {!fromBaseId
                                            ? 'Select From Base First'
                                            : availableAssetTypes.length === 0
                                                ? 'No Assets Available'
                                                : 'Select Asset Type'}
                                    </option>

                                    {availableAssetTypes.map(
                                        (assetType) => {

                                            const item =
                                                availableInventory.find(
                                                    (inventoryItem) =>
                                                        Number(
                                                            inventoryItem.assetTypeId
                                                        ) ===
                                                        Number(
                                                            assetType.id
                                                        )
                                                );

                                            return (

                                                <option
                                                    key={assetType.id}
                                                    value={assetType.id}
                                                >
                                                    {assetType.name}
                                                    {' '}
                                                    - Available:
                                                    {' '}
                                                    {item?.quantity || 0}
                                                </option>

                                            );
                                        }
                                    )}

                                </select>

                                {/* AVAILABLE QUANTITY */}

                                {assetTypeId && (

                                    <p
                                        style={{
                                            margin:
                                                '6px 0 0',
                                            fontSize:
                                                '13px',
                                            color:
                                                '#166534',
                                            fontWeight:
                                                '600'
                                        }}
                                    >
                                        Available Quantity:
                                        {' '}
                                        {availableQuantity}
                                    </p>

                                )}

                            </div>

                            {/* =================================================
                                QUANTITY
                            ================================================= */}

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
                                    max={
                                        availableQuantity ||
                                        undefined
                                    }
                                    placeholder="Enter quantity"
                                    value={quantity}
                                    onChange={(e) => {

                                        const value =
                                            e.target.value;

                                        if (
                                            value === ''
                                        ) {

                                            setQuantity('');

                                            return;
                                        }

                                        const numericValue =
                                            Number(value);

                                        if (
                                            numericValue >
                                            availableQuantity
                                        ) {

                                            setQuantity(
                                                availableQuantity
                                            );

                                        } else {

                                            setQuantity(
                                                numericValue
                                            );
                                        }

                                    }}
                                    required
                                    disabled={!assetTypeId}
                                    style={{
                                        width: '100%',
                                        height: '42px',
                                        padding: '0 12px',
                                        border: '1px solid #d1d5db',
                                        borderRadius: '6px',
                                        outline: 'none',
                                        fontSize: '14px',
                                        color: 'black',
                                        boxSizing: 'border-box',
                                        backgroundColor:
                                            assetTypeId
                                                ? 'white'
                                                : '#f3f4f6'
                                    }}
                                />

                                {assetTypeId && (

                                    <p
                                        style={{
                                            margin:
                                                '6px 0 0',
                                            fontSize:
                                                '12px',
                                            color:
                                                '#6b7280'
                                        }}
                                    >
                                        Maximum:
                                        {' '}
                                        {availableQuantity}
                                    </p>

                                )}

                            </div>

                            {/* =================================================
                                TRANSFER DATE
                            ================================================= */}

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
                                    Transfer Date
                                </label>

                                <input
                                    type="date"
                                    value={transferDate}
                                    onChange={(e) =>
                                        setTransferDate(
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

                            {/* =================================================
                                STATUS
                            ================================================= */}

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
                                    Status
                                </label>

                                <select
                                    value={status}
                                    onChange={(e) =>
                                        setStatus(
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
                                        color: 'black',
                                        backgroundColor: 'white'
                                    }}
                                >

                                    <option value="COMPLETED">
                                        Completed
                                    </option>

                                    <option value="CANCELLED">
                                        Cancelled
                                    </option>

                                </select>

                            </div>

                            {/* =================================================
                                BUTTONS
                            ================================================= */}

                            <div
                                style={{
                                    gridColumn: '1 / -1',
                                    display: 'flex',
                                    justifyContent: 'flex-end',
                                    gap: '10px',
                                    marginTop: '4px'
                                }}
                            >

                                <button
                                    type="button"
                                    onClick={resetForm}
                                    style={{
                                        height: '42px',
                                        padding: '0 20px',
                                        border: '1px solid #cbd5e1',
                                        borderRadius: '6px',
                                        backgroundColor: 'white',
                                        color: 'red',
                                        fontSize: '14px',
                                        cursor: 'pointer'
                                    }}
                                >
                                    Cancel
                                </button>

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
                                        cursor: 'pointer'
                                    }}
                                >
                                    {editingId
                                        ? 'Update Transfer'
                                        : 'Save Transfer'}
                                </button>

                            </div>

                        </form>

                    </div>

                )}

                {/* =================================================
                    LIST HEADER
                ================================================= */}

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
                        Transfer Records
                    </h2>

                    <p
                        style={{
                            margin: '4px 0 0',
                            fontSize: '13px',
                            color: '#9ca3af'
                        }}
                    >
                        {transfers.length} transfer
                        {transfers.length !== 1
                            ? 's'
                            : ''} registered
                    </p>

                </div>

                {/* =================================================
                    TABLE
                ================================================= */}

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
                            minWidth: '1050px'
                        }}
                    >

                        <thead>

                            <tr>

                                <th
                                    style={{
                                        padding: '14px 18px',
                                        backgroundColor: '#ADD8E6',
                                        borderBottom:
                                            '1px solid #e5e7eb',
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
                                        padding: '14px 18px',
                                        backgroundColor: '#ADD8E6',
                                        borderBottom:
                                            '1px solid #e5e7eb',
                                        color: 'black',
                                        textAlign: 'center',
                                        fontSize: '16px',
                                        fontWeight: 'bold'
                                    }}
                                >
                                    From Base
                                </th>

                                <th
                                    style={{
                                        padding: '14px 18px',
                                        backgroundColor: '#ADD8E6',
                                        borderBottom:
                                            '1px solid #e5e7eb',
                                        color: 'black',
                                        textAlign: 'center',
                                        fontSize: '16px',
                                        fontWeight: 'bold'
                                    }}
                                >
                                    To Base
                                </th>

                                <th
                                    style={{
                                        padding: '14px 18px',
                                        backgroundColor: '#ADD8E6',
                                        borderBottom:
                                            '1px solid #e5e7eb',
                                        color: 'black',
                                        textAlign: 'center',
                                        fontSize: '16px',
                                        fontWeight: 'bold'
                                    }}
                                >
                                    Asset Type
                                </th>

                                <th
                                    style={{
                                        padding: '14px 18px',
                                        backgroundColor: '#ADD8E6',
                                        borderBottom:
                                            '1px solid #e5e7eb',
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
                                        borderBottom:
                                            '1px solid #e5e7eb',
                                        color: 'black',
                                        textAlign: 'center',
                                        fontSize: '16px',
                                        fontWeight: 'bold'
                                    }}
                                >
                                    Transfer Date
                                </th>

                                <th
                                    style={{
                                        padding: '14px 18px',
                                        backgroundColor: '#ADD8E6',
                                        borderBottom:
                                            '1px solid #e5e7eb',
                                        color: 'black',
                                        textAlign: 'center',
                                        fontSize: '16px',
                                        fontWeight: 'bold'
                                    }}
                                >
                                    Status
                                </th>

                                <th
                                    style={{
                                        padding: '14px 18px',
                                        backgroundColor: '#ADD8E6',
                                        borderBottom:
                                            '1px solid #e5e7eb',
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

                            {transfers.length === 0 ? (

                                <tr>

                                    <td
                                        colSpan="8"
                                        style={{
                                            padding: '45px 20px',
                                            textAlign: 'center',
                                            color: '#9ca3af',
                                            fontSize: '14px'
                                        }}
                                    >
                                        No transfer records found
                                    </td>

                                </tr>

                            ) : (

                                transfers.map(
                                    (transfer) => (

                                        <tr
                                            key={transfer.id}
                                        >

                                            <td
                                                style={{
                                                    padding:
                                                        '17px 18px',
                                                    borderBottom:
                                                        '1px solid #f1f5f9',
                                                    color: 'black',
                                                    fontSize: '14px'
                                                }}
                                            >
                                                {transfer.id}
                                            </td>

                                            <td
                                                style={{
                                                    padding:
                                                        '17px 18px',
                                                    borderBottom:
                                                        '1px solid #f1f5f9',
                                                    color: 'black',
                                                    fontSize: '14px'
                                                }}
                                            >
                                                {transfer.fromBaseId}
                                            </td>

                                            <td
                                                style={{
                                                    padding:
                                                        '17px 18px',
                                                    borderBottom:
                                                        '1px solid #f1f5f9',
                                                    color: 'black',
                                                    fontSize: '14px'
                                                }}
                                            >
                                                {transfer.toBaseId}
                                            </td>

                                            <td
                                                style={{
                                                    padding:
                                                        '17px 18px',
                                                    borderBottom:
                                                        '1px solid #f1f5f9',
                                                    color: 'black',
                                                    fontSize: '14px'
                                                }}
                                            >
                                                {transfer.assetTypeId}
                                            </td>

                                            <td
                                                style={{
                                                    padding:
                                                        '17px 18px',
                                                    borderBottom:
                                                        '1px solid #f1f5f9',
                                                    color: 'black',
                                                    fontSize: '14px',
                                                    fontWeight: '600'
                                                }}
                                            >
                                                {transfer.quantity}
                                            </td>

                                            <td
                                                style={{
                                                    padding:
                                                        '17px 18px',
                                                    borderBottom:
                                                        '1px solid #f1f5f9',
                                                    color: 'black',
                                                    fontSize: '14px'
                                                }}
                                            >
                                                {transfer.transferDate}
                                            </td>

                                            <td
                                                style={{
                                                    padding:
                                                        '17px 18px',
                                                    borderBottom:
                                                        '1px solid #f1f5f9',
                                                    color:
                                                        transfer.status ===
                                                        'COMPLETED'
                                                            ? '#166534'
                                                            : '#b91c1c',
                                                    fontSize: '13px',
                                                    fontWeight: '600'
                                                }}
                                            >
                                                {transfer.status}
                                            </td>

                                            <td
                                                style={{
                                                    padding:
                                                        '17px 18px',
                                                    borderBottom:
                                                        '1px solid #f1f5f9'
                                                }}
                                            >

                                                <div
                                                    style={{
                                                        display:
                                                            'flex',
                                                        gap: '8px'
                                                    }}
                                                >

                                                    <button
                                                        onClick={() =>
                                                            handleEdit(
                                                                transfer
                                                            )
                                                        }
                                                        style={{
                                                            height:
                                                                '32px',
                                                            padding:
                                                                '0 12px',
                                                            border:
                                                                '1px solid #cbd5e1',
                                                            borderRadius:
                                                                '5px',
                                                            backgroundColor:
                                                                'white',
                                                            color:
                                                                '#334155',
                                                            fontSize:
                                                                '13px',
                                                            cursor:
                                                                'pointer'
                                                        }}
                                                    >
                                                        Edit
                                                    </button>

                                                    <button
                                                        onClick={() =>
                                                            handleDelete(
                                                                transfer.id
                                                            )
                                                        }
                                                        style={{
                                                            height:
                                                                '32px',
                                                            padding:
                                                                '0 12px',
                                                            border:
                                                                '1px solid #fecaca',
                                                            borderRadius:
                                                                '5px',
                                                            backgroundColor:
                                                                '#fffafa',
                                                            color:
                                                                '#b91c1c',
                                                            fontSize:
                                                                '13px',
                                                            cursor:
                                                                'pointer'
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

export default Transfers;