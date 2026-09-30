import { Link, useNavigate } from 'react-router-dom';


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

        return null;
    }
}


function Navbar() {

    const navigate = useNavigate();

    const role = getUserRole();


    const handleLogout = () => {

        localStorage.removeItem('token');

        navigate('/');

        window.location.reload();

    };


    return (

        <nav
            style={{
                width: '100%',
                minHeight: '68px',
                backgroundColor: '#6c757d',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0 35px',
                color: 'black',
                boxSizing: 'border-box',
                gap: '25px'
            }}
        >

            {/* TITLE */}

            <div
                style={{
                    fontSize: '19px',
                    fontWeight: 'bold',
                    color: 'White',
                    whiteSpace: 'nowrap'
                }}
            >
                Military Asset Management
            </div>


            {/* LINKS */}

            <div
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'flex-end',
                    gap: '20px',
                    flexWrap: 'wrap',
                    fontSize: '19px',
                    fontWeight: 'bold',
                }}
            >

                <NavLink
                    to="/"
                    text="Dashboard"
                />

                <NavLink
                    to="/inventory"
                    text="Inventory"
                />

                <NavLink
                    to="/bases"
                    text="Bases"
                />

                <NavLink
                    to="/asset-types"
                    text="Assets"
                />

                <NavLink
                    to="/purchases"
                    text="Purchases"
                />

                <NavLink
                    to="/transfers"
                    text="Transfers"
                />

                <NavLink
                    to="/assignments"
                    text="Assignments"
                />

                <NavLink
                    to="/expenditures"
                    text="Expenditures"
                />


                {/* ADMIN ONLY */}

                {role === 'ADMIN' && (

                    <>
                        <NavLink
                            to="/users"
                            text="Users"
                        />

                        <NavLink
                            to="/audit-logs"
                            text="Audit Logs"
                        />
                    </>

                )}


                {/* ROLE */}

                <span
                    style={{
                        padding: '6px 10px',
                        borderRadius: '5px',
                        backgroundColor: 'none',
                        color: 'white',
                        fontSize: '13px',
                        fontWeight: 'bold',
                        whiteSpace: 'nowrap'
                    }}
                >
                    {role}
                </span>


                {/* LOGOUT */}

                <button
                    onClick={handleLogout}
                    style={{
                        height: '36px',
                        padding: '0 15px',
                        border: 'none',
                        borderRadius: '6px',
                        backgroundColor: 'red',
                        color: 'white',
                        fontSize: '13px',
                        fontWeight: 'bold',
                        cursor: 'pointer'
                    }}
                >
                    Logout
                </button>

            </div>

        </nav>
    );
}


function NavLink({ to, text }) {

    return (

        <Link
            to={to}
            style={{
                color: 'black',
                textDecoration: 'none',
                fontSize: '13px',
                whiteSpace: 'nowrap',
                fontSize: '15px',
            }}
        >
            {text}
        </Link>

    );

}


export default Navbar;