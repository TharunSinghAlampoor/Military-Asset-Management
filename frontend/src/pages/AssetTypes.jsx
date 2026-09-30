import { useEffect, useState } from 'react';
import api from '../services/api';
import Navbar from '../components/Navbar';

function AssetTypes() {

    const [assetTypes, setAssetTypes] = useState([]);

    const [name, setName] = useState('');
    const [category, setCategory] = useState('');

    const [editingId, setEditingId] = useState(null);
    const [showForm, setShowForm] = useState(false);


    const getAssetTypes = async () => {

        try {

            const response = await api.get('/api/asset-types');

            setAssetTypes(response.data);

        } catch (error) {

            console.error(
                'Asset types error:',
                error
            );

        }

    };


    useEffect(() => {

        getAssetTypes();

    }, []);


    const handleSubmit = async (e) => {

        e.preventDefault();

        try {

            const assetTypeData = {
                name: name,
                category: category
            };


            if (editingId) {

                await api.put(
                    `/api/asset-types/${editingId}`,
                    assetTypeData
                );

                alert('Asset type updated successfully');

            } else {

                await api.post(
                    '/api/asset-types',
                    assetTypeData
                );

                alert('Asset type created successfully');

            }


            setName('');
            setCategory('');
            setEditingId(null);
            setShowForm(false);

            getAssetTypes();

        } catch (error) {

            console.error(
                'Save asset type error:',
                error
            );

            alert('Failed to save asset type');

        }

    };


    const handleEdit = (assetType) => {

        setEditingId(assetType.id);

        setName(assetType.name);

        setCategory(assetType.category);

        setShowForm(true);

    };


    const handleDelete = async (id) => {

        const confirmDelete = window.confirm(
            'Are you sure you want to delete this asset type?'
        );

        if (!confirmDelete) {
            return;
        }


        try {

            await api.delete(
                `/api/asset-types/${id}`
            );

            alert('Asset type deleted successfully');

            getAssetTypes();

        } catch (error) {

            console.error(
                'Delete asset type error:',
                error
            );

            alert('Failed to delete asset type');

        }

    };


    const handleCancel = () => {

        setEditingId(null);

        setName('');

        setCategory('');

        setShowForm(false);

    };


    const openAddForm = () => {

        setEditingId(null);

        setName('');

        setCategory('');

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
                            Asset Types
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
                            Add Asset Type
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
                                    color: 'black'
                                }}
                            >
                                {editingId
                                    ? 'Edit Asset Type'
                                    : 'Add New Asset Type'}
                            </h2>


                            <button
                                type="button"
                                onClick={handleCancel}
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
                                    '1fr 1fr auto',
                                gap: '14px',
                                alignItems: 'end'
                            }}
                        >

                            {/* NAME */}

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
                                    Asset Type Name
                                </label>

                                <input
                                    type="text"
                                    placeholder="Enter asset type"
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
                                        fontSize: '16px',
                                        color: 'black'
                                    }}
                                />

                            </div>


                            {/* CATEGORY */}

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
                                    Category
                                </label>

                                <input
                                    type="text"
                                    placeholder="Enter category"
                                    value={category}
                                    onChange={(e) =>
                                        setCategory(e.target.value)
                                    }
                                    required
                                    style={{
                                        width: '100%',
                                        height: '42px',
                                        padding: '0 12px',
                                        border: '1px solid #d1d5db',
                                        borderRadius: '6px',
                                        outline: 'none',
                                        fontSize: '16px',
                                        color: 'black'
                                    }}
                                />

                            </div>


                            {/* SUBMIT */}

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
                                    ? 'Update Asset Type'
                                    : 'Save Asset Type'}
                            </button>

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
                        All Asset Types
                    </h2>

                    <p
                        style={{
                            margin: '4px 0 0',
                            fontSize: '13px',
                            color: '#9ca3af'
                        }}
                    >
                        {assetTypes.length} asset type
                        {assetTypes.length !== 1 ? 's' : ''} registered
                    </p>

                </div>


                {/* TABLE */}

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
                                    Asset Type
                                </th>

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
                                    Category
                                </th>

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
                                    Actions
                                </th>

                            </tr>

                        </thead>


                        <tbody>

                            {assetTypes.length === 0 ? (

                                <tr>

                                    <td
                                        colSpan="4"
                                        style={{
                                            padding: '45px 20px',
                                            textAlign: 'center',
                                            color: '#9ca3af',
                                            fontSize: '14px'
                                        }}
                                    >
                                        No asset types registered yet
                                    </td>

                                </tr>

                            ) : (

                                assetTypes.map((assetType) => (

                                    <tr key={assetType.id}>

                                        <td
                                            style={{
                                                padding: '17px 20px',
                                                borderBottom: '1px solid #f1f5f9',
                                                color: 'black',
                                                textAlign: 'center',
                                                fontSize: '16px'
                                            }}
                                        >
                                            {assetType.id}
                                        </td>


                                        <td
                                            style={{
                                                padding: '17px 20px',
                                                borderBottom: '1px solid #f1f5f9',
                                                color: 'black',
                                                textAlign: 'center',
                                                fontSize: '16px'
                                            }}
                                        >
                                            {assetType.name}
                                        </td>


                                        <td
                                            style={{
                                                padding: '17px 20px',
                                                borderBottom: '1px solid #f1f5f9',
                                                color: 'black',
                                                textAlign: 'center',
                                                fontSize: '16px'
                                            }}
                                        >
                                            {assetType.category}
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
                                                        handleEdit(assetType)
                                                    }
                                                    style={{
                                                        height: '32px',
                                                        padding: '0 12px',
                                                        border: '1px solid yellow',
                                                        borderRadius: '5px',
                                                        backgroundColor: 'yellow',
                                                        color: 'black',
                                                        fontSize: '13px',
                                                        fontWeight:'bold',
                                                        cursor: 'pointer',
                                                        marginRight: '35px',
                                                    }}
                                                >
                                                    Edit
                                                </button>


                                                <button
                                                    onClick={() =>
                                                        handleDelete(
                                                            assetType.id
                                                        )
                                                    }
                                                    style={{
                                                        height: '32px',
                                                        padding: '0 12px',
                                                        border: '1px solid #fecaca',
                                                        borderRadius: '5px',
                                                        backgroundColor: 'red',
                                                        color: 'white',
                                                        fontSize: '13px',
                                                        fontWeight:'bold',
                                                        cursor: 'pointer',
                                                        marginLeft:'10px'
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

export default AssetTypes;