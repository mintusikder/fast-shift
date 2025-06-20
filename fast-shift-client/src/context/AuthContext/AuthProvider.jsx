import React from 'react';
import { AuthContest } from './AuthContext';

const AuthProvider = ({children}) => {
    const authInfo ={

    }
    return (
        <AuthContest value={authInfo}>
            {children}
        </AuthContest >
    );
};

export default AuthProvider;