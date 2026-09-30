import {
    BrowserRouter,
    Routes,
    Route,
    Navigate
} from 'react-router-dom';

import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Inventory from './pages/Inventory';
import Bases from './pages/Bases';
import AssetTypes from './pages/AssetTypes';
import Purchases from './pages/Purchases';
import Transfers from './pages/Transfers';
import Assignments from './pages/Assignments';
import Expenditures from './pages/Expenditures';
import Users from './pages/Users';
import AuditLogs from './pages/AuditLogs';


function getUserRole() {

    const token = localStorage.getItem('token');

    if (!token) {
        return null;
    }

    try {

        const payload = JSON.parse(
            atob(
                token.split('.')[1]
                    .replace(/-/g, '+')
                    .replace(/_/g, '/')
            )
        );

        return payload.role;

    } catch (error) {

        console.error(
            'Token error:',
            error
        );

        return null;
    }
}


function ProtectedRoute({
    children,
    allowedRoles
}) {

    const role = getUserRole();

    if (!role) {

        return <Navigate to="/login" replace />;

    }

    if (
        allowedRoles &&
        !allowedRoles.includes(role)
    ) {

        return <Navigate to="/" replace />;

    }

    return children;
}


function App() {

    return (

        <BrowserRouter>

            <Routes>

                {/* LOGIN */}

                <Route
                    path="/login"
                    element={<Login />}
                />


                {/* DASHBOARD */}

                <Route
                    path="/"
                    element={
                        <ProtectedRoute>
                            <Dashboard />
                        </ProtectedRoute>
                    }
                />


                {/* INVENTORY */}

                <Route
                    path="/inventory"
                    element={
                        <ProtectedRoute
                            allowedRoles={[
                                'ADMIN',
                                'BASE_COMMANDER',
                                'LOGISTICS_OFFICER'
                            ]}
                        >
                            <Inventory />
                        </ProtectedRoute>
                    }
                />


                {/* BASES */}

                <Route
                    path="/bases"
                    element={
                        <ProtectedRoute
                            allowedRoles={[
                                'ADMIN',
                                'BASE_COMMANDER',
                                'LOGISTICS_OFFICER'
                            ]}
                        >
                            <Bases />
                        </ProtectedRoute>
                    }
                />


                {/* ASSET TYPES */}

                <Route
                    path="/asset-types"
                    element={
                        <ProtectedRoute
                            allowedRoles={[
                                'ADMIN',
                                'BASE_COMMANDER',
                                'LOGISTICS_OFFICER'
                            ]}
                        >
                            <AssetTypes />
                        </ProtectedRoute>
                    }
                />


                {/* PURCHASES */}

                <Route
                    path="/purchases"
                    element={
                        <ProtectedRoute
                            allowedRoles={[
                                'ADMIN',
                                'BASE_COMMANDER',
                                'LOGISTICS_OFFICER'
                            ]}
                        >
                            <Purchases />
                        </ProtectedRoute>
                    }
                />


                {/* TRANSFERS */}

                <Route
                    path="/transfers"
                    element={
                        <ProtectedRoute
                            allowedRoles={[
                                'ADMIN',
                                'BASE_COMMANDER',
                                'LOGISTICS_OFFICER'
                            ]}
                        >
                            <Transfers />
                        </ProtectedRoute>
                    }
                />


                {/* ASSIGNMENTS */}

                <Route
                    path="/assignments"
                    element={
                        <ProtectedRoute
                            allowedRoles={[
                                'ADMIN',
                                'BASE_COMMANDER',
                                'LOGISTICS_OFFICER'
                            ]}
                        >
                            <Assignments />
                        </ProtectedRoute>
                    }
                />


                {/* EXPENDITURES */}

                <Route
                    path="/expenditures"
                    element={
                        <ProtectedRoute
                            allowedRoles={[
                                'ADMIN',
                                'BASE_COMMANDER',
                                'LOGISTICS_OFFICER'
                            ]}
                        >
                            <Expenditures />
                        </ProtectedRoute>
                    }
                />


                {/* USERS */}

                <Route
                    path="/users"
                    element={
                        <ProtectedRoute
                            allowedRoles={[
                                'ADMIN'
                            ]}
                        >
                            <Users />
                        </ProtectedRoute>
                    }
                />


                {/* AUDIT LOGS */}

                <Route
                    path="/audit-logs"
                    element={
                        <ProtectedRoute
                            allowedRoles={[
                                'ADMIN'
                            ]}
                        >
                            <AuditLogs />
                        </ProtectedRoute>
                    }
                />


                {/* UNKNOWN URL */}

                <Route
                    path="*"
                    element={
                        <Navigate
                            to="/"
                            replace
                        />
                    }
                />

            </Routes>

        </BrowserRouter>
    );
}

export default App;