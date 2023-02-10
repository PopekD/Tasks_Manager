import { Routes, Route } from 'react-router-dom';
import Login from './pages/Login/Login';
import Home from './pages/Home/Home'
import Register from './pages/Register/Register'
import PrivateRoute from './components/privateRoutes';
import Profile from './pages/Profile/Profile'


const App: React.FC = () => {
    return (
        <>
            <Routes >
                <Route element={<PrivateRoute />}>
                    <Route path="/" element={<Home />} />
                    <Route path="/Profile" element={<Profile/>} />
                </Route>
                <Route path="/Login" element={<Login />} />
                <Route path="/Register" element={<Register />} />
            </Routes>
        </>
    );
};

export default App;
