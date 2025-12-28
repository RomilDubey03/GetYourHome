import React from 'react'
import { useSelector } from 'react-redux'
import { Outlet, Navigate } from 'react-router-dom'

function PrivateRoute() {

    const { currentUser } = useSelector(state => state.auth)

    if (currentUser) {
        return <Outlet />
    }
    else {
        return <Navigate to="/sign-in" />
    }
}

export default PrivateRoute 