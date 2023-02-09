
import { Navigate, Outlet } from 'react-router-dom'

const privateRoutes = () => {

    function hasJWT() {
        let flag = false;

        localStorage.getItem("token") ? flag = true : flag = false
        console.log(localStorage.getItem("token"))
        return flag
    }

    return (
        hasJWT() ? <Outlet/> : <Navigate to="/Login"/>
    );   
}

export default privateRoutes;