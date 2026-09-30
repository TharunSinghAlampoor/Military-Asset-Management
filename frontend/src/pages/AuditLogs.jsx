import { useEffect, useState } from 'react';
import api from '../services/api';
import Navbar from '../components/Navbar';

function AuditLogs() {

    const [logs, setLogs] = useState([]);

    const getLogs = async () => {

        try {

            const response =
                await api.get('/api/audit-logs');

            setLogs(response.data);

        } catch (error) {

            console.error(
                'Audit logs error:',
                error
            );

        }

    };


    useEffect(() => {

        getLogs();

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
                    padding: '38px 30px 60px',
                    boxSizing: 'border-box'
                }}
            >

                {/* HEADER */}

                <div
                    style={{
                        marginBottom: '28px'
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
                        Audit Logs
                    </h1>

                    <p
                        style={{
                            margin: '7px 0 0',
                            fontSize: '14px',
                            color: 'black'
                        }}
                    >
                        View system activity and user actions
                    </p>

                </div>


                {/* SUMMARY */}

                <div
                    style={{
                        display: 'grid',
                        gridTemplateColumns:
                            'repeat(3, minmax(0, 1fr))',
                        gap: '16px',
                        marginBottom: '30px'
                    }}
                >

                    <div style={summaryCardStyle}>

                        <p style={summaryLabelStyle}>
                            Total Log Records
                        </p>

                        <p style={summaryValueStyle}>
                            {logs.length}
                        </p>

                    </div>


                    <div style={summaryCardStyle}>

                        <p style={summaryLabelStyle}>
                            Create Actions
                        </p>

                        <p style={summaryValueStyle}>
                            {
                                logs.filter(
                                    log =>
                                        log.action === 'CREATE'
                                ).length
                            }
                        </p>

                    </div>


                    <div style={summaryCardStyle}>

                        <p style={summaryLabelStyle}>
                            Update / Delete Actions
                        </p>

                        <p style={summaryValueStyle}>
                            {
                                logs.filter(
                                    log =>
                                        log.action === 'UPDATE' ||
                                        log.action === 'DELETE'
                                ).length
                            }
                        </p>

                    </div>

                </div>


                {/* TABLE HEADER */}

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
                        Activity Records
                    </h2>

                    <p
                        style={{
                            margin: '4px 0 0',
                            fontSize: '13px',
                            color: '#9ca3af'
                        }}
                    >
                        {logs.length} log
                        {logs.length !== 1
                            ? 's'
                            : ''} recorded
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
                                    User ID
                                </th>

                                <th style={headerStyle}>
                                    Action
                                </th>

                                <th style={headerStyle}>
                                    Entity
                                </th>

                                <th style={headerStyle}>
                                    Entity ID
                                </th>

                                <th style={headerStyle}>
                                    Details
                                </th>

                                <th style={headerStyle}>
                                    Date & Time
                                </th>

                            </tr>

                        </thead>


                        <tbody>

                            {logs.length === 0 ? (

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
                                        No audit logs found
                                    </td>

                                </tr>

                            ) : (

                                [...logs]
                                    .reverse()
                                    .map((log) => (

                                        <tr key={log.id}>

                                            <td style={cellStyle}>
                                                {log.id}
                                            </td>


                                            <td style={cellStyle}>
                                                {log.userId || '-'}
                                            </td>


                                            <td
                                                style={{
                                                    ...cellStyle,
                                                    fontWeight: '600',
                                                    color:
                                                        log.action === 'CREATE'
                                                            ? '#166534'
                                                            : log.action === 'DELETE'
                                                                ? '#b91c1c'
                                                                : '#92400e'
                                                }}
                                            >
                                                {log.action}
                                            </td>


                                            <td
                                                style={{
                                                    ...cellStyle,
                                                    color: '#1f2937',
                                                    fontWeight: '500'
                                                }}
                                            >
                                                {log.entityType}
                                            </td>


                                            <td style={cellStyle}>
                                                {log.entityId || '-'}
                                            </td>


                                            <td
                                                style={{
                                                    ...cellStyle,
                                                    maxWidth: '300px'
                                                }}
                                            >
                                                {log.details || '-'}
                                            </td>


                                            <td style={cellStyle}>
                                                {log.createdAt
                                                    ? new Date(
                                                        log.createdAt
                                                    ).toLocaleString()
                                                    : '-'}
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


const summaryCardStyle = {
     backgroundColor: '#f6fff8',
        border: '1px solid #90caf9',
        borderRadius: '10px',
        padding: '22px',
        minHeight: '145px',
        boxSizing: 'border-box'
};


const summaryLabelStyle = {
    margin: 0,
    fontSize: '13px',
    color: '#64748b'
};


const summaryValueStyle = {
    margin: '10px 0 0',
    fontSize: '26px',
    fontWeight: '600',
    color: '#172554'
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


export default AuditLogs;