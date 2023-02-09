
import { Navigate, Outlet } from 'react-router-dom'

const privateRoutes = () => {

    function hasJWT() {
        let flag = false;

        localStorage.getItem("token") ? flag = true : flag = false
        return flag
    }

    return (
        hasJWT() ? <Outlet/> : <Navigate to="/Login"/>
    );   
}

export default privateRoutes;