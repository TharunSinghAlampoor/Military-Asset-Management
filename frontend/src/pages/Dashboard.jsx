import { useEffect, useState } from 'react';

import api from '../services/api';

import Navbar from '../components/Navbar';


function Dashboard() {

    // =========================================================
    // BASIC DASHBOARD DATA
    // =========================================================

    const [summary, setSummary] = useState(null);

    const [dashboardDetails, setDashboardDetails] =
        useState(null);

    const [errorMessage, setErrorMessage] =
        useState('');

    const [loading, setLoading] =
        useState(true);

    const [filterLoading, setFilterLoading] =
        useState(false);


    // =========================================================
    // RBAC INFORMATION
    // =========================================================

    const role =
        localStorage.getItem('role') || '';

    const loggedInBaseId =
        localStorage.getItem('baseId') || '';


    // =========================================================
    // REAL DATABASE FILTER DATA
    // =========================================================

    const [bases, setBases] = useState([]);

    const [assetTypes, setAssetTypes] = useState([]);


    // =========================================================
    // FILTER VALUES
    // =========================================================

    const [fromDate, setFromDate] =
        useState('');

    const [toDate, setToDate] =
        useState('');

    const [selectedBase, setSelectedBase] =
        useState('');

    const [selectedAssetType, setSelectedAssetType] =
        useState('');


    // =========================================================
    // POPUP
    // =========================================================

    const [showMovementPopup, setShowMovementPopup] =
        useState(false);


    // =========================================================
    // GET INITIAL DASHBOARD DATA
    // =========================================================

    useEffect(() => {

        const loadDashboard = async () => {

            try {

                setLoading(true);
                setErrorMessage('');

                // ---------------------------------------------
                // GET ORIGINAL DASHBOARD SUMMARY
                // ---------------------------------------------

                const summaryResponse =
                    await api.get(
                        '/api/dashboard/summary'
                    );

                console.log(
                    'Dashboard Summary:',
                    summaryResponse.data
                );

                setSummary(
                    summaryResponse.data
                );


                // ---------------------------------------------
                // GET REAL BASE DATA
                // ---------------------------------------------

                const baseResponse =
                    await api.get(
                        '/api/bases'
                    );

                console.log(
                    'Real Bases:',
                    baseResponse.data
                );

                let baseData =
                    Array.isArray(baseResponse.data)
                        ? baseResponse.data
                        : [];


                // ---------------------------------------------
                // BASE COMMANDER
                // ONLY SHOW OWN BASE
                // ---------------------------------------------

                if (
                    role === 'BASE_COMMANDER' &&
                    loggedInBaseId
                ) {

                    baseData =
                        baseData.filter(
                            base =>
                                String(base.id) ===
                                String(loggedInBaseId)
                        );

                    setSelectedBase(
                        String(loggedInBaseId)
                    );
                }

                setBases(baseData);


                // ---------------------------------------------
                // GET REAL ASSET TYPE DATA
                // ---------------------------------------------

                const assetTypeResponse =
                    await api.get(
                        '/api/asset-types'
                    );

                console.log(
                    'Real Asset Types:',
                    assetTypeResponse.data
                );

                const assetTypeData =
                    Array.isArray(assetTypeResponse.data)
                        ? assetTypeResponse.data
                        : [];

                setAssetTypes(
                    assetTypeData
                );


                // ---------------------------------------------
                // GET INITIAL DASHBOARD DETAILS
                // ---------------------------------------------

                const detailsResponse =
                    await api.get(
                        '/api/dashboard/details'
                    );

                console.log(
                    'Dashboard Details:',
                    detailsResponse.data
                );

                setDashboardDetails(
                    detailsResponse.data
                );

            } catch (error) {

                console.error(
                    'Dashboard error:',
                    error
                );

                console.error(
                    'Dashboard response:',
                    error.response
                );

                setErrorMessage(
                    error.response?.data ||
                    'Failed to load dashboard data.'
                );

            } finally {

                setLoading(false);

            }

        };


        loadDashboard();

    }, []);


    // =========================================================
    // APPLY REAL DATABASE FILTERS
    // =========================================================

    useEffect(() => {

        const applyFilters = async () => {

            // Do not run during first render
            // until initial dashboard is loaded.

            if (!summary) {
                return;
            }


            // ---------------------------------------------
            // BASE COMMANDER
            // BACKEND ALSO ENFORCES THIS
            // ---------------------------------------------

            let baseId =
                selectedBase || '';


            if (
                role === 'BASE_COMMANDER' &&
                loggedInBaseId
            ) {

                baseId =
                    loggedInBaseId;

            }


            try {

                setFilterLoading(true);

                setErrorMessage('');


                // ---------------------------------------------
                // BUILD QUERY PARAMETERS
                // ---------------------------------------------

                const params = {};


                if (fromDate) {

                    params.fromDate =
                        fromDate;

                }


                if (toDate) {

                    params.toDate =
                        toDate;

                }


                if (baseId) {

                    params.baseId =
                        baseId;

                }


                if (selectedAssetType) {

                    params.assetTypeId =
                        selectedAssetType;

                }


                console.log(
                    'Dashboard Filter Parameters:',
                    params
                );


                // ---------------------------------------------
                // CALL REAL BACKEND
                // ---------------------------------------------

                const response =
                    await api.get(
                        '/api/dashboard/details',
                        {
                            params: params
                        }
                    );


                console.log(
                    'Filtered Dashboard:',
                    response.data
                );


                setDashboardDetails(
                    response.data
                );

            } catch (error) {

                console.error(
                    'Dashboard filter error:',
                    error
                );

                console.error(
                    'Filter response:',
                    error.response
                );


                setErrorMessage(
                    error.response?.data ||
                    'Failed to apply dashboard filters.'
                );

            } finally {

                setFilterLoading(false);

            }

        };


        applyFilters();

    }, [
        fromDate,
        toDate,
        selectedBase,
        selectedAssetType
    ]);


    // =========================================================
    // LOADING SCREEN
    // =========================================================

    if (loading || !summary) {

        return (

            <div
                style={{
                    minHeight: '100vh',
                    backgroundColor: '#cbf3f0'
                }}
            >

                <Navbar />

                <div
                    style={{
                        maxWidth: '1250px',
                        margin: '0 auto',
                        padding: '40px'
                    }}
                >

                    {errorMessage ? (

                        <div
                            style={{
                                padding: '20px',
                                backgroundColor: '#fff1f2',
                                border: '1px solid #fecdd3',
                                borderRadius: '8px',
                                color: '#be123c'
                            }}
                        >

                            <strong>
                                Dashboard Error
                            </strong>

                            <p>
                                {errorMessage}
                            </p>

                        </div>

                    ) : (

                        'Loading dashboard...'

                    )}

                </div>

            </div>

        );

    }


    // =========================================================
    // CARD STYLE
    // =========================================================

    const cardStyle = {

        backgroundColor: '#f6fff8',

        border: '1px solid #90caf9',

        borderRadius: '10px',

        padding: '22px',

        minHeight: '145px',

        boxSizing: 'border-box'

    };


    // =========================================================
    // NUMBER STYLE
    // =========================================================

    const numberStyle = {

        margin: '14px 0 8px',

        fontSize: '30px',

        fontWeight: '600',

        color: 'black'

    };


    // =========================================================
    // LABEL STYLE
    // =========================================================

    const labelStyle = {

        margin: 0,

        fontSize: '18px',

        color: 'black',

        fontWeight: 'bold'

    };


    // =========================================================
    // DESCRIPTION STYLE
    // =========================================================

    const descriptionStyle = {

        margin: 0,

        fontSize: '15px',

        color: 'green'

    };


    // =========================================================
    // ROLE NAME
    // =========================================================

    const getRoleName = () => {

        if (role === 'ADMIN') {

            return 'Administrator';

        }

        if (role === 'BASE_COMMANDER') {

            return 'Base Commander';

        }

        if (role === 'LOGISTICS_OFFICER') {

            return 'Logistics Officer';

        }

        return 'User';

    };


    // =========================================================
    // REAL FILTERED DASHBOARD VALUES
    // =========================================================

    const details =
        dashboardDetails || {};


    // NEW: ASSET NAME AND CATEGORY

    const assetName =
        details.assetName || 'All Assets';

    const assetCategory =
        details.category || '';


    const openingBalance =
        details.openingBalance ?? 0;


    const closingBalance =
        details.closingBalance ?? 0;


    const purchases =
        details.purchases ?? 0;


    const transferIn =
        details.transferIn ?? 0;


    const transferOut =
        details.transferOut ?? 0;


    const netMovement =
        details.netMovement ?? 0;


    const assigned =
        details.assigned ?? 0;


    const expended =
        details.expended ?? 0;


    // =========================================================
    // ALL ASSET ITEMS AND INVENTORY QUANTITIES
    // =========================================================

    const assetItems =
        Array.isArray(details.assetItems)
            ? details.assetItems
            : [];


    // =========================================================
    // CLEAR FILTERS
    // =========================================================

    const clearFilters = () => {

        setFromDate('');

        setToDate('');

        setSelectedBase('');

        setSelectedAssetType('');

    };


    // =========================================================
    // BASE COMMANDER RESET PROTECTION
    // =========================================================

    const handleBaseChange = (value) => {

        if (role === 'BASE_COMMANDER') {

            return;

        }

        setSelectedBase(value);

    };


    // =========================================================
    // RETURN DASHBOARD
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
                    padding: '35px 35px 60px',
                    boxSizing: 'border-box'
                }}
            >


                {/* =================================================
                    RBAC ACCESS
                ================================================= */}

                <section
                    style={{
                        backgroundColor: 'white',
                        border: '1px solid #90caf9',
                        borderRadius: '10px',
                        padding: '18px 22px',
                        marginBottom: '28px',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                    }}
                >

                    <div>

                        <p
                            style={{
                                margin: 0,
                                fontSize: '13px',
                                color: '#64748b'
                            }}
                        >
                            Current Access Role
                        </p>


                        <h2
                            style={{
                                margin: '5px 0 0',
                                fontSize: '20px',
                                color: '#172554'
                            }}
                        >
                            {getRoleName()}
                        </h2>


                        {role === 'BASE_COMMANDER' && (

                            <p
                                style={{
                                    margin: '5px 0 0',
                                    fontSize: '13px',
                                    color: '#64748b'
                                }}
                            >
                                Assigned Base ID: {loggedInBaseId}
                            </p>

                        )}

                    </div>


                    <div
                        style={{
                            padding: '8px 15px',
                            borderRadius: '20px',
                            backgroundColor: '#ecfdf5',
                            color: '#047857',
                            fontSize: '13px',
                            fontWeight: '600'
                        }}
                    >
                        RBAC ACTIVE
                    </div>

                </section>



                {/* =================================================
                    DASHBOARD FILTERS
                ================================================= */}

                <section
                    style={{
                        backgroundColor: 'white',
                        border: '1px solid #90caf9',
                        borderRadius: '10px',
                        padding: '22px',
                        marginBottom: '32px'
                    }}
                >

                    <div
                        style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            marginBottom: '18px'
                        }}
                    >

                        <div>

                            <h2
                                style={{
                                    margin: 0,
                                    fontSize: '19px',
                                    fontWeight: '600',
                                    color: '#1e293b'
                                }}
                            >
                                Dashboard Filters
                            </h2>


                            <p
                                style={{
                                    margin: '5px 0 0',
                                    fontSize: '13px',
                                    color: '#64748b'
                                }}
                            >
                                Filter using real database data
                            </p>

                        </div>


                        <button
                            onClick={clearFilters}
                            style={{
                                height: '38px',
                                padding: '0 15px',
                                border: '1px solid #cbd5e1',
                                borderRadius: '6px',
                                backgroundColor: 'white',
                                color: '#334155',
                                cursor: 'pointer'
                            }}
                        >
                            Clear Filters
                        </button>

                    </div>



                    <div
                        style={{
                            display: 'grid',
                            gridTemplateColumns:
                                'repeat(4, minmax(0, 1fr))',
                            gap: '15px'
                        }}
                    >


                        {/* =================================================
                            FROM DATE
                        ================================================= */}

                        <div>

                            <label
                                style={filterLabelStyle}
                            >
                                From Date
                            </label>


                            <input
                                type="date"
                                value={fromDate}
                                onChange={(e) =>
                                    setFromDate(
                                        e.target.value
                                    )
                                }
                                style={filterInputStyle}
                            />

                        </div>



                        {/* =================================================
                            TO DATE
                        ================================================= */}

                        <div>

                            <label
                                style={filterLabelStyle}
                            >
                                To Date
                            </label>


                            <input
                                type="date"
                                value={toDate}
                                onChange={(e) =>
                                    setToDate(
                                        e.target.value
                                    )
                                }
                                style={filterInputStyle}
                            />

                        </div>



                        {/* =================================================
                            REAL BASE FILTER
                        ================================================= */}

                        <div>

                            <label
                                style={filterLabelStyle}
                            >
                                Base
                            </label>


                            <select
                                value={selectedBase}
                                onChange={(e) =>
                                    handleBaseChange(
                                        e.target.value
                                    )
                                }
                                disabled={
                                    role ===
                                    'BASE_COMMANDER'
                                }
                                style={{
                                    ...filterInputStyle,
                                    cursor:
                                        role ===
                                        'BASE_COMMANDER'
                                            ? 'not-allowed'
                                            : 'pointer',
                                    backgroundColor:
                                        role ===
                                        'BASE_COMMANDER'
                                            ? '#f1f5f9'
                                            : 'white'
                                }}
                            >

                                {role !==
                                    'BASE_COMMANDER' && (

                                    <option value="">
                                        All Bases
                                    </option>

                                )}


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



                        {/* =================================================
                            REAL EQUIPMENT TYPE FILTER
                        ================================================= */}

                        <div>

                            <label
                                style={filterLabelStyle}
                            >
                                Equipment Type
                            </label>


                            <select
                                value={selectedAssetType}
                                onChange={(e) =>
                                    setSelectedAssetType(
                                        e.target.value
                                    )
                                }
                                style={{
                                    ...filterInputStyle,
                                    cursor: 'pointer'
                                }}
                            >

                                <option value="">
                                    All Equipment Types
                                </option>


                                {assetTypes.map(
                                    (assetType) => (

                                        <option
                                            key={
                                                assetType.id
                                            }
                                            value={
                                                assetType.id
                                            }
                                        >
                                            {assetType.name}
                                        </option>

                                    )
                                )}

                            </select>

                        </div>

                    </div>


                    {/* =================================================
                        FILTER LOADING
                    ================================================= */}

                    {filterLoading && (

                        <p
                            style={{
                                marginTop: '15px',
                                marginBottom: 0,
                                fontSize: '13px',
                                color: '#2563eb'
                            }}
                        >
                            Updating dashboard using
                            selected filters...
                        </p>

                    )}


                    {errorMessage && (

                        <div
                            style={{
                                marginTop: '15px',
                                padding: '12px',
                                backgroundColor: '#fff1f2',
                                border: '1px solid #fecdd3',
                                borderRadius: '6px',
                                color: '#be123c',
                                fontSize: '13px'
                            }}
                        >
                            {errorMessage}
                        </div>

                    )}

                </section>



                {/* =================================================
                    KEY METRICS
                ================================================= */}

                <section
                    style={{
                        marginBottom: '32px'
                    }}
                >

                    <div
                        style={{
                            marginBottom: '16px'
                        }}
                    >

                        <h2
                            style={{
                                margin: 0,
                                fontSize: '19px',
                                fontWeight: '600',
                                color: '#1e293b'
                            }}
                        >
                            Key Metrics
                        </h2>


                        {/* NEW: SHOW ASSET NAME */}

                        <p
                            style={{
                                margin: '8px 0 0',
                                fontSize: '16px',
                                fontWeight: '600',
                                color: '#2563eb'
                            }}
                        >
                            Asset: {assetName}
                            {assetCategory &&
                                ` (${assetCategory})`}
                        </p>


                        <p
                            style={{
                                margin: '5px 0 0',
                                fontSize: '13px',
                                color: '#64748b'
                            }}
                        >
                            Real filtered asset movement
                        </p>

                    </div>



                    <div
                        style={{
                            display: 'grid',
                            gridTemplateColumns:
                                'repeat(5, minmax(0, 1fr))',
                            gap: '16px'
                        }}
                    >


                        {/* OPENING BALANCE */}

                        <div style={cardStyle}>

                            <p style={labelStyle}>
                                Opening Balance
                            </p>

                            <div style={numberStyle}>
                                {openingBalance}
                            </div>

                            <p style={descriptionStyle}>
                                Opening asset balance
                            </p>

                        </div>



                        {/* CLOSING BALANCE */}

                        <div style={cardStyle}>

                            <p style={labelStyle}>
                                Closing Balance
                            </p>

                            <div style={numberStyle}>
                                {closingBalance}
                            </div>

                            <p style={descriptionStyle}>
                                Closing asset balance
                            </p>

                        </div>



                        {/* NET MOVEMENT */}

                        <div
                            style={{
                                ...cardStyle,
                                cursor: 'pointer'
                            }}
                            onClick={() =>
                                setShowMovementPopup(true)
                            }
                        >

                            <p style={labelStyle}>
                                Net Movement
                            </p>

                            <div style={numberStyle}>
                                {netMovement}
                            </div>

                            <p style={descriptionStyle}>
                                Click for details
                            </p>

                        </div>



                        {/* ASSIGNED */}

                        <div style={cardStyle}>

                            <p style={labelStyle}>
                                Assigned
                            </p>

                            <div style={numberStyle}>
                                {assigned}
                            </div>

                            <p style={descriptionStyle}>
                                Assets assigned
                            </p>

                        </div>



                        {/* EXPENDED */}

                        <div style={cardStyle}>

                            <p style={labelStyle}>
                                Expended
                            </p>

                            <div style={numberStyle}>
                                {expended}
                            </div>

                            <p style={descriptionStyle}>
                                Assets expended
                            </p>

                        </div>

                    </div>

                </section>
                                {/* =================================================
                    ASSET INVENTORY DETAILS
                ================================================= */}

                <section
                    style={{
                        marginBottom: '32px'
                    }}
                >

                    <div
                        style={{
                            marginBottom: '16px'
                        }}
                    >

                        <h2
                            style={{
                                margin: 0,
                                fontSize: '19px',
                                fontWeight: '600',
                                color: '#1e293b'
                            }}
                        >
                            Asset Inventory
                        </h2>

                        <p
                            style={{
                                margin: '5px 0 0',
                                fontSize: '13px',
                                color: '#64748b'
                            }}
                        >
                            Asset names, categories and current quantities
                        </p>

                    </div>


                    <div
                        style={{
                            backgroundColor: 'white',
                            border: '1px solid #90caf9',
                            borderRadius: '10px',
                            overflow: 'hidden'
                        }}
                    >

                        {assetItems.length === 0 ? (

                            <div
                                style={{
                                    padding: '25px',
                                    textAlign: 'center',
                                    color: '#64748b'
                                }}
                            >
                                No asset inventory data available.
                            </div>

                        ) : (

                            <div
                                style={{
                                    overflowX: 'auto'
                                }}
                            >

                                <table
                                    style={{
                                        width: '100%',
                                        borderCollapse: 'collapse'
                                    }}
                                >

                                    <thead>

                                        <tr
                                            style={{
                                                backgroundColor: '#f1f5f9'
                                            }}
                                        >

                                            <th
                                                style={assetTableHeaderStyle}
                                            >
                                                Asset Name
                                            </th>

                                            <th
                                                style={assetTableHeaderStyle}
                                            >
                                                Category
                                            </th>

                                            <th
                                                style={{
                                                    ...assetTableHeaderStyle,
                                                    textAlign: 'right'
                                                }}
                                            >
                                                Quantity
                                            </th>

                                        </tr>

                                    </thead>


                                    <tbody>

                                        {assetItems.map((item) => (

                                            <tr
                                                key={item.assetTypeId}
                                                style={{
                                                    borderTop:
                                                        '1px solid #e2e8f0'
                                                }}
                                            >

                                                <td
                                                    style={
                                                        assetTableCellStyle
                                                    }
                                                >
                                                    {item.assetName}
                                                </td>


                                                <td
                                                    style={
                                                        assetTableCellStyle
                                                    }
                                                >
                                                    {item.category}
                                                </td>


                                                <td
                                                    style={{
                                                        ...assetTableCellStyle,
                                                        textAlign: 'right',
                                                        fontWeight: '600'
                                                    }}
                                                >
                                                    {item.quantity ?? 0}
                                                </td>

                                            </tr>

                                        ))}

                                    </tbody>

                                </table>

                            </div>

                        )}

                    </div>

                </section>



                {/* =================================================
                    INVENTORY MANAGEMENT
                ================================================= */}

                <section
                    style={{
                        marginBottom: '32px'
                    }}
                >

                    <div
                        style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            marginBottom: '16px'
                        }}
                    >

                        <div>

                            <h2
                                style={{
                                    margin: 0,
                                    fontSize: '19px',
                                    fontWeight: '600',
                                    color: '#1e293b'
                                }}
                            >
                                Inventory Management
                            </h2>

                            <p
                                style={{
                                    margin: '5px 0 0',
                                    fontSize: '13px',
                                    color: '#64748b'
                                }}
                            >
                                Current inventory overview
                            </p>

                        </div>

                    </div>


                    <div
                        style={{
                            display: 'grid',
                            gridTemplateColumns:
                                'repeat(3, minmax(0, 1fr))',
                            gap: '16px'
                        }}
                    >

                        <div style={cardStyle}>

                            <p style={labelStyle}>
                                Opening
                            </p>

                            <div style={numberStyle}>
                                {openingBalance}
                            </div>

                            <p style={descriptionStyle}>
                                Starting quantity
                            </p>

                        </div>


                        <div style={cardStyle}>

                            <p style={labelStyle}>
                                Closing
                            </p>

                            <div style={numberStyle}>
                                {closingBalance}
                            </div>

                            <p style={descriptionStyle}>
                                Current quantity
                            </p>

                        </div>


                        <div style={cardStyle}>

                            <p style={labelStyle}>
                                Available
                            </p>

                            <div style={numberStyle}>
                                {closingBalance}
                            </div>

                            <p style={descriptionStyle}>
                                Available inventory
                            </p>

                        </div>

                    </div>

                </section>



                {/* =================================================
                    OPERATIONS
                ================================================= */}

                <section
                    style={{
                        marginBottom: '32px'
                    }}
                >

                    <div
                        style={{
                            marginBottom: '16px'
                        }}
                    >

                        <h2
                            style={{
                                margin: 0,
                                fontSize: '19px',
                                fontWeight: '600',
                                color: '#1e293b'
                            }}
                        >
                            Operations
                        </h2>

                        <p
                            style={{
                                margin: '5px 0 0',
                                fontSize: '13px',
                                color: '#64748b'
                            }}
                        >
                            Asset movement and utilization
                        </p>

                    </div>


                    <div
                        style={{
                            display: 'grid',
                            gridTemplateColumns:
                                'repeat(4, minmax(0, 1fr))',
                            gap: '16px'
                        }}
                    >


                        {/* =================================================
                            PURCHASES
                        ================================================= */}

                        <div style={cardStyle}>

                            <p style={labelStyle}>
                                Purchases
                            </p>

                            <div style={numberStyle}>
                                {purchases}
                            </div>

                            <p style={descriptionStyle}>
                                Purchased quantity
                            </p>

                        </div>



                        {/* =================================================
                            TRANSFER IN
                        ================================================= */}

                        <div style={cardStyle}>

                            <p style={labelStyle}>
                                Transfer In
                            </p>

                            <div style={numberStyle}>
                                {transferIn}
                            </div>

                            <p style={descriptionStyle}>
                                Assets received
                            </p>

                        </div>



                        {/* =================================================
                            TRANSFER OUT
                        ================================================= */}

                        <div style={cardStyle}>

                            <p style={labelStyle}>
                                Transfer Out
                            </p>

                            <div style={numberStyle}>
                                {transferOut}
                            </div>

                            <p style={descriptionStyle}>
                                Assets transferred
                            </p>

                        </div>



                        {/* =================================================
                            ASSIGNED
                        ================================================= */}

                        <div style={cardStyle}>

                            <p style={labelStyle}>
                                Assigned
                            </p>

                            <div style={numberStyle}>
                                {assigned}
                            </div>

                            <p style={descriptionStyle}>
                                Assets assigned
                            </p>

                        </div>

                    </div>

                </section>



                {/* =================================================
                    MOVEMENT SUMMARY
                ================================================= */}

                <section
                    style={{
                        marginBottom: '32px'
                    }}
                >

                    <div
                        style={{
                            backgroundColor: 'white',
                            border: '1px solid #90caf9',
                            borderRadius: '10px',
                            padding: '22px'
                        }}
                    >

                        <div
                            style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                marginBottom: '18px'
                            }}
                        >

                            <div>

                                <h2
                                    style={{
                                        margin: 0,
                                        fontSize: '19px',
                                        fontWeight: '600',
                                        color: '#1e293b'
                                    }}
                                >
                                    Movement Summary
                                </h2>

                                <p
                                    style={{
                                        margin: '5px 0 0',
                                        fontSize: '13px',
                                        color: '#64748b'
                                    }}
                                >
                                    Summary of asset movement
                                </p>

                            </div>


                            <button
                                onClick={() =>
                                    setShowMovementPopup(true)
                                }
                                style={{
                                    padding: '9px 15px',
                                    border: 'none',
                                    borderRadius: '6px',
                                    backgroundColor: '#2563eb',
                                    color: 'white',
                                    cursor: 'pointer',
                                    fontWeight: '600'
                                }}
                            >
                                View Details
                            </button>

                        </div>


                        <div
                            style={{
                                display: 'grid',
                                gridTemplateColumns:
                                    'repeat(3, minmax(0, 1fr))',
                                gap: '16px'
                            }}
                        >

                            <div
                                style={{
                                    padding: '18px',
                                    borderRadius: '8px',
                                    backgroundColor: '#f8fafc'
                                }}
                            >

                                <p
                                    style={{
                                        margin: 0,
                                        fontSize: '14px',
                                        color: '#64748b'
                                    }}
                                >
                                    Purchases
                                </p>

                                <h3
                                    style={{
                                        margin: '8px 0 0',
                                        fontSize: '25px',
                                        color: '#1e293b'
                                    }}
                                >
                                    {purchases}
                                </h3>

                            </div>


                            <div
                                style={{
                                    padding: '18px',
                                    borderRadius: '8px',
                                    backgroundColor: '#f8fafc'
                                }}
                            >

                                <p
                                    style={{
                                        margin: 0,
                                        fontSize: '14px',
                                        color: '#64748b'
                                    }}
                                >
                                    Transfer In
                                </p>

                                <h3
                                    style={{
                                        margin: '8px 0 0',
                                        fontSize: '25px',
                                        color: '#1e293b'
                                    }}
                                >
                                    {transferIn}
                                </h3>

                            </div>


                            <div
                                style={{
                                    padding: '18px',
                                    borderRadius: '8px',
                                    backgroundColor: '#f8fafc'
                                }}
                            >

                                <p
                                    style={{
                                        margin: 0,
                                        fontSize: '14px',
                                        color: '#64748b'
                                    }}
                                >
                                    Transfer Out
                                </p>

                                <h3
                                    style={{
                                        margin: '8px 0 0',
                                        fontSize: '25px',
                                        color: '#1e293b'
                                    }}
                                >
                                    {transferOut}
                                </h3>

                            </div>

                        </div>

                    </div>

                </section>



                {/* =================================================
                    BALANCE CALCULATION
                ================================================= */}

                <section
                    style={{
                        marginBottom: '32px'
                    }}
                >

                    <div
                        style={{
                            backgroundColor: 'white',
                            border: '1px solid #90caf9',
                            borderRadius: '10px',
                            padding: '22px'
                        }}
                    >

                        <h2
                            style={{
                                margin: '0 0 18px',
                                fontSize: '19px',
                                fontWeight: '600',
                                color: '#1e293b'
                            }}
                        >
                            Balance Calculation
                        </h2>


                        <div
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '12px'
                            }}
                        >

                            <div
                                style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    padding: '12px 0',
                                    borderBottom:
                                        '1px solid #e2e8f0'
                                }}
                            >

                                <span>
                                    Opening Balance
                                </span>

                                <strong>
                                    {openingBalance}
                                </strong>

                            </div>


                            <div
                                style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    padding: '12px 0',
                                    borderBottom:
                                        '1px solid #e2e8f0'
                                }}
                            >

                                <span>
                                    + Purchases
                                </span>

                                <strong>
                                    {purchases}
                                </strong>

                            </div>


                            <div
                                style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    padding: '12px 0',
                                    borderBottom:
                                        '1px solid #e2e8f0'
                                }}
                            >

                                <span>
                                    + Transfer In
                                </span>

                                <strong>
                                    {transferIn}
                                </strong>

                            </div>


                            <div
                                style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    padding: '12px 0',
                                    borderBottom:
                                        '1px solid #e2e8f0'
                                }}
                            >

                                <span>
                                    - Transfer Out
                                </span>

                                <strong>
                                    {transferOut}
                                </strong>

                            </div>


                            <div
                                style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    padding: '12px 0',
                                    borderBottom:
                                        '1px solid #e2e8f0'
                                }}
                            >

                                <span>
                                    - Assigned
                                </span>

                                <strong>
                                    {assigned}
                                </strong>

                            </div>


                            <div
                                style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    padding: '12px 0',
                                    borderBottom:
                                        '1px solid #e2e8f0'
                                }}
                            >

                                <span>
                                    - Expended
                                </span>

                                <strong>
                                    {expended}
                                </strong>

                            </div>


                            <div
                                style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    padding: '15px 0',
                                    fontSize: '18px'
                                }}
                            >

                                <strong>
                                    Closing Balance
                                </strong>

                                <strong>
                                    {closingBalance}
                                </strong>

                            </div>

                        </div>

                    </div>

                </section>



                {/* =================================================
                    DATE FILTER INFORMATION
                ================================================= */}

                <section
                    style={{
                        marginBottom: '32px'
                    }}
                >

                    <div
                        style={{
                            backgroundColor: '#eff6ff',
                            border: '1px solid #bfdbfe',
                            borderRadius: '10px',
                            padding: '18px'
                        }}
                    >

                        <h3
                            style={{
                                margin: '0 0 8px',
                                fontSize: '16px',
                                color: '#1e3a8a'
                            }}
                        >
                            Current Filter
                        </h3>


                        <p
                            style={{
                                margin: 0,
                                fontSize: '14px',
                                color: '#475569'
                            }}
                        >

                            Date:
                            {' '}

                            {fromDate
                                ? fromDate
                                : 'Start'}

                            {' '}to{' '}

                            {toDate
                                ? toDate
                                : 'Today'}

                            {' | '}

                            Base:
                            {' '}

                            {selectedBase
                                ? (
                                    bases.find(
                                        base =>
                                            String(base.id) ===
                                            String(selectedBase)
                                    )?.name ||
                                    selectedBase
                                )
                                : 'All Bases'}

                            {' | '}

                            Equipment:
                            {' '}

                            {selectedAssetType
                                ? (
                                    assetTypes.find(
                                        asset =>
                                            String(asset.id) ===
                                            String(
                                                selectedAssetType
                                            )
                                    )?.name ||
                                    selectedAssetType
                                )
                                : 'All Equipment Types'}

                        </p>

                    </div>

                </section>



                {/* =================================================
                    NET MOVEMENT POPUP
                ================================================= */}

                {showMovementPopup && (

                    <div
                        style={{
                            position: 'fixed',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            backgroundColor:
                                'rgba(0, 0, 0, 0.45)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            zIndex: 1000,
                            padding: '20px',
                            boxSizing: 'border-box'
                        }}
                        onClick={() =>
                            setShowMovementPopup(false)
                        }
                    >

                        <div
                            style={{
                                width: '100%',
                                maxWidth: '550px',
                                backgroundColor: 'white',
                                borderRadius: '12px',
                                padding: '25px',
                                boxSizing: 'border-box'
                            }}
                            onClick={(e) =>
                                e.stopPropagation()
                            }
                        >

                            <div
                                style={{
                                    display: 'flex',
                                    justifyContent:
                                        'space-between',
                                    alignItems: 'center',
                                    marginBottom: '20px'
                                }}
                            >

                                <div>

                                    <h2
                                        style={{
                                            margin: 0,
                                            fontSize: '20px',
                                            color: '#1e293b'
                                        }}
                                    >
                                        Net Movement Details
                                    </h2>

                                    <p
                                        style={{
                                            margin: '5px 0 0',
                                            fontSize: '13px',
                                            color: '#64748b'
                                        }}
                                    >
                                        {assetName}
                                    </p>

                                </div>


                                <button
                                    onClick={() =>
                                        setShowMovementPopup(
                                            false
                                        )
                                    }
                                    style={{
                                        width: '35px',
                                        height: '35px',
                                        border: 'none',
                                        borderRadius: '50%',
                                        backgroundColor:
                                            '#f1f5f9',
                                        color: '#334155',
                                        cursor: 'pointer',
                                        fontSize: '18px'
                                    }}
                                >
                                    ×
                                </button>

                            </div>


                            <div
                                style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: '12px'
                                }}
                            >

                                <div
                                    style={{
                                        display: 'flex',
                                        justifyContent:
                                            'space-between',
                                        padding: '14px',
                                        backgroundColor:
                                            '#f8fafc',
                                        borderRadius: '8px'
                                    }}
                                >

                                    <span>
                                        Purchases
                                    </span>

                                    <strong>
                                        +{purchases}
                                    </strong>

                                </div>


                                <div
                                    style={{
                                        display: 'flex',
                                        justifyContent:
                                            'space-between',
                                        padding: '14px',
                                        backgroundColor:
                                            '#f8fafc',
                                        borderRadius: '8px'
                                    }}
                                >

                                    <span>
                                        Transfer In
                                    </span>

                                    <strong>
                                        +{transferIn}
                                    </strong>

                                </div>


                                <div
                                    style={{
                                        display: 'flex',
                                        justifyContent:
                                            'space-between',
                                        padding: '14px',
                                        backgroundColor:
                                            '#f8fafc',
                                        borderRadius: '8px'
                                    }}
                                >

                                    <span>
                                        Transfer Out
                                    </span>

                                    <strong>
                                        -{transferOut}
                                    </strong>

                                </div>


                                <div
                                    style={{
                                        display: 'flex',
                                        justifyContent:
                                            'space-between',
                                        padding: '16px',
                                        backgroundColor:
                                            '#eff6ff',
                                        border:
                                            '1px solid #bfdbfe',
                                        borderRadius: '8px',
                                        fontSize: '17px'
                                    }}
                                >

                                    <strong>
                                        Net Movement
                                    </strong>

                                    <strong>
                                        {netMovement}
                                    </strong>

                                </div>

                            </div>


                            <button
                                onClick={() =>
                                    setShowMovementPopup(
                                        false
                                    )
                                }
                                style={{
                                    width: '100%',
                                    marginTop: '20px',
                                    height: '42px',
                                    border: 'none',
                                    borderRadius: '7px',
                                    backgroundColor:
                                        '#2563eb',
                                    color: 'white',
                                    cursor: 'pointer',
                                    fontWeight: '600'
                                }}
                            >
                                Close
                            </button>

                        </div>

                    </div>

                )}
                {/* =================================================
                    RESPONSIVE / MOBILE INFORMATION
                ================================================= */}

                <section
                    style={{
                        marginBottom: '20px'
                    }}
                >

                    <div
                        style={{
                            backgroundColor: 'white',
                            border: '1px solid #90caf9',
                            borderRadius: '10px',
                            padding: '18px'
                        }}
                    >

                        <p
                            style={{
                                margin: 0,
                                fontSize: '13px',
                                color: '#64748b',
                                lineHeight: '1.6'
                            }}
                        >
                            Dashboard values are calculated from
                            the current inventory, purchase,
                            transfer, assignment and expenditure
                            records stored in the database.
                        </p>

                    </div>

                </section>


            </main>

        </div>

    );

}


// =============================================================
// FILTER LABEL STYLE
// =============================================================

const filterLabelStyle = {

    display: 'block',

    marginBottom: '7px',

    fontSize: '13px',

    fontWeight: '600',

    color: '#334155'

};


// =============================================================
// FILTER INPUT STYLE
// =============================================================

const filterInputStyle = {

    width: '100%',

    height: '40px',

    padding: '0 10px',

    border: '1px solid #cbd5e1',

    borderRadius: '6px',

    backgroundColor: 'white',

    color: '#334155',

    fontSize: '14px',

    boxSizing: 'border-box',

    outline: 'none'

};


// =============================================================
// ASSET INVENTORY TABLE HEADER
// =============================================================

const assetTableHeaderStyle = {

    padding: '14px 18px',

    textAlign: 'left',

    fontSize: '14px',

    fontWeight: '600',

    color: '#334155'

};


// =============================================================
// ASSET INVENTORY TABLE CELL
// =============================================================

const assetTableCellStyle = {

    padding: '14px 18px',

    fontSize: '14px',

    color: '#334155'

};


export default Dashboard;