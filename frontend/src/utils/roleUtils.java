export const getRole = () => {
    return localStorage.getItem('role');
};

export const isAdmin = () => {
    return getRole() === 'ADMIN';
};

export const isBaseCommander = () => {
    return getRole() === 'BASE_COMMANDER';
};

export const isLogisticsOfficer = () => {
    return getRole() === 'LOGISTICS_OFFICER';
};

export const canManageMasterData = () => {
    return isAdmin();
};

export const canManageOwnBase = () => {
    return (
        isAdmin() ||
        isBaseCommander() ||
        isLogisticsOfficer()
    );
};