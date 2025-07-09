import React, { useContext } from 'react'
import { AuthContext } from '../contexts/AuthContex';

const useAuth = () => {
    const authInfo = useContext(AuthContext)
    return authInfo;
}

export default useAuth
