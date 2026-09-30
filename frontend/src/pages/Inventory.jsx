import { useEffect, useState } from 'react';
import api from '../services/api';
import Navbar from '../components/Navbar';

function Inventory() {

    const [inventory, setInventory] = useState([]);

    useEffect(() => {

        const getInventory = async () => {

            try {

                const response = await api.get('/api/inventory');

                console.log('INVENTORY DATA:', response.data);

                setInventory(response.data);

            } catch (error) {

                console.error('Inventory error:', error);

            }

        };

        getInventory();

    }, []);


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
                    padding: '40px 35px 60px',
                    boxSizing: 'border-box'
                }}
            >

                {/* PAGE HEADER */}

                <div
                    style={{
                        marginBottom: '30px'
                    }}
                >

                    <h1
                        style={{
                            margin: 0,
                            fontSize: '30px',
                            fontWeight: '600',
                            color: 'black'
                        }}
                    >
                        Inventory
                    </h1>

                </div>


                {/* INVENTORY SUMMARY */}

                <div
                    style={{
                        display: 'grid',
                        gridTemplateColumns:
                            'repeat(3, minmax(0, 1fr))',
                        gap: '16px',
                        marginBottom: '30px'
                    }}
                >

                    <div
                        style={{
                            backgroundColor: '#f6fff8',
                            border: '1px solid #90caf9',
                            borderRadius: '8px',
                            padding: '20px 22px'
                        }}
                    >

                        <p
                            style={{
                                margin: 0,
                                fontSize: '16px',
                                color: 'black',
                                fontWeight: 'bold'
                            }}
                        >
                            Inventory Records
                        </p>

                        <p
                            style={{
                                margin: '10px 0 0',
                                fontSize: '28px',
                                fontWeight: '600',
                                color: 'black'
                            }}
                        >
                            {inventory.length}
                        </p>

                    </div>


                    <div
                        style={{
                           backgroundColor: '#f6fff8',
                           border: '1px solid #90caf9',
                            borderRadius: '8px',
                            padding: '20px 22px'
                        }}
                    >

                        <p
                            style={{
                                margin: 0,
                                fontSize: '18px',
                                color: 'black',
                                fontWeight: 'bold'
                            }}
                        >
                            Bases With Inventory
                        </p>

                        <p
                            style={{
                                margin: '10px 0 0',
                                fontSize: '28px',
                                fontWeight: '600',
                                color: 'black'
                            }}
                        >
                            {
                                new Set(
                                    inventory.map(
                                        item => item.baseId
                                    )
                                ).size
                            }
                        </p>

                    </div>


                    <div
                        style={{
                           backgroundColor: '#f6fff8',
                           border: '1px solid #90caf9',
                            borderRadius: '8px',
                            padding: '20px 22px'
                        }}
                    >

                        <p
                            style={{
                                margin: 0,
                                fontSize: '18px',
                                color: 'black',
                                fontWeight: 'bold'
                            }}
                        >
                            Total Quantity
                        </p>

                        <p
                            style={{
                                margin: '10px 0 0',
                                fontSize: '28px',
                                fontWeight: '600',
                                color: 'black'
                            }}
                        >
                            {
                                inventory.reduce(
                                    (total, item) =>
                                        total + Number(item.quantity || 0),
                                    0
                                )
                            }
                        </p>

                    </div>

                </div>


                {/* TABLE SECTION */}

                <div>

                    <h2
                        style={{
                            
                            margin: '0 0 16px',
                            fontSize: '22px',
                            fontWeight: '600',
                            color: 'black'
                        }}
                    >
                        Inventory Details
                    </h2>


                    <div
                        style={{
                            width: '100%',
                            backgroundColor: '#ffffff',
                            border: '1px solid #e2e8f0',
                            borderRadius: '8px',
                            overflowX: 'auto',
                            boxSizing: 'border-box'
                        }}
                    >

                        <table
                            style={{
                                width: '100%',
                                borderCollapse: 'collapse',
                                minWidth: '650px'
                            }}
                        >

                            <thead>

                                <tr>

                                    <th
                                        style={{
                                            padding: '16px 20px',
                                            backgroundColor: '#ADD8E6',
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
                                            padding: '16px 20px',
                                            backgroundColor: '#ADD8E6',
                                            color: 'black',
                                            textAlign: 'center',
                                            fontSize: '16px',
                                            fontWeight: 'bold'
                                        }}
                                    >
                                        Base ID
                                    </th>

                                    <th
                                        style={{
                                            padding: '16px 20px',
                                            backgroundColor: '#ADD8E6',
                                            color: 'black',
                                            textAlign: 'center',
                                            fontSize: '16px',
                                            fontWeight: 'bold'
                                        }}
                                    >
                                        Asset Type ID
                                    </th>

                                    <th
                                        style={{
                                            padding: '16px 20px',
                                            backgroundColor: '#ADD8E6',
                                            color: 'black',
                                            textAlign: 'center',
                                            fontSize: '16px',
                                            fontWeight: 'bold'
                                        }}
                                    >
                                        Quantity
                                    </th>

                                </tr>

                            </thead>


                            <tbody>

                                {inventory.length === 0 ? (

                                    <tr>

                                        <td
                                            colSpan="4"
                                            style={{
                                                padding: '30px',
                                                textAlign: 'center',
                                                color: '#64748b',
                                                fontSize: '14px'
                                            }}
                                        >
                                            No inventory records found
                                        </td>

                                    </tr>

                                ) : (

                                    inventory.map((item) => (

                                        <tr key={item.id}>

                                            <td
                                                style={{
                                                    padding: '16px 20px',
                                                    borderBottom:
                                                        '1px solid #e5e7eb',
                                                    fontSize: '18px',
                                                    color: 'black',
                                                    textAlign: 'center',
                                                }}
                                            >
                                                {item.id}
                                            </td>

                                            <td
                                                style={{
                                                    padding: '16px 20px',
                                                    borderBottom:
                                                        '1px solid #e5e7eb',
                                                    color: 'black',
                                                    textAlign: 'center',
                                                    fontSize: '18px',
                                                }}
                                            >
                                                {item.baseId}
                                            </td>

                                            <td
                                                style={{
                                                    padding: '16px 20px',
                                                    borderBottom:
                                                        '1px solid #e5e7eb',
                                                    color: 'black',
                                                    textAlign: 'center',
                                                    fontSize: '18px',
                                                }}
                                            >
                                                {item.assetTypeId}
                                            </td>

                                            <td
                                                style={{
                                                    padding: '16px 20px',
                                                    borderBottom:
                                                        '1px solid #e5e7eb',
                                                    fontSize: '14px',
                                                    color: 'black',
                                                    textAlign: 'center',
                                                    fontSize: '18px',
                                                }}
                                            >
                                                {item.quantity}
                                            </td>

                                        </tr>

                                    ))

                                )}

                            </tbody>

                        </table>

                    </div>

                </div>

            </main>

        </div>
    );
}

export default Inventory;