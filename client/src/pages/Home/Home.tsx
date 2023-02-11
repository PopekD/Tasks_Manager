import React, { useState, useEffect } from 'react'
import './Home.css'
import { Button, ButtonGroup } from "@chakra-ui/button"
import ReactPaginate from 'react-paginate';
import home from '../../assets/home.png'
import user from '../../assets/user.png'
import toast, { Toaster } from 'react-hot-toast'
import Popup from 'reactjs-popup';
import { useNavigate } from 'react-router-dom';
import 'reactjs-popup/dist/index.css';

const Home: React.FC = () => {

    const navigate = useNavigate();
    const [exercises, setExercises] = useState([{
        username: "", name: "", description: ""
    }]);
    const [loading, setLoading] = useState(true)
    const [currentPage, setCurrentPage] = useState(0)
    const PER_PAGE = 4
    const offset = currentPage * PER_PAGE;
    const pageCount = Math.ceil(exercises.length / PER_PAGE);

    function handlePageClick({ selected }: { selected: number }) {
        setCurrentPage(selected);
    }

    function dismissToast() {
        toast.dismiss();
    }

    function showToastWithButton(message: any) {
        const MyToast = (
            <div className='Toast'>
                <p>{message}</p>
                <Button size={'sm'} colorScheme="red" onClick={dismissToast} style={{ alignSelf: 'center'}}>Dismiss</Button>
            </div>

        );
        toast(MyToast, {
            duration: Infinity,
            style: {
                display: 'flex',
                justifySelf: 'center',
                minWidth: '80vw',
                minHeight: '40vh'
            }
        });
    }

    const fetchSharedExercises = async (): Promise<any> =>{

        try {
            const data = await fetch("/api/GetSharedExercises", {
                method: "POST",
            })
            const response = await data.text()
            if (response.valueOf() !== "[]") {
                const e = JSON.parse(response.valueOf())
                setExercises(e)
            }
            setLoading(false)
        }
        catch (e) {
            console.log(e)
        }
    }
    useEffect(() => {
        fetchSharedExercises();
    }, [])

    const signOut = () => {
        localStorage.clear();
        return window.location.reload();
    }

    return (
        loading ?
            <div>
                Loading
            </div>
            :

        <div className='HomePage'>

            <div className='HomeMenu'>
                <Button colorScheme={"white"} style={{ marginBottom: '20%' }} onClick={() => navigate("/")}><img src={home} alt="home icon" /> </Button>
                <Button colorScheme={"white"} onClick={() => navigate("/Profile")}><img src={user} alt="user icon" /></Button>
            </div>
            <div className='HomeMain'>
                <div className='HomeTop'>
                    <div className='HomeTopLeft'>
                        <h1> Welcome To Slush 2023 Task Management Platform !</h1>
                            <h2 style={{ fontWeight:'700', borderBottom: "1px solid white"}}> SHARED ASSIGNMENTS: </h2>
                    </div>
                    <div className='HomeTopRight'>
                        <Button size={"lg"} colorScheme="yellow" onClick={() => signOut()}>Sign Out</Button>
                    </div>
                </div>

                <div className='HomeBottom'>
                    <div className='HomeBottomLeft'>
                            <div className='HomeBottomLeftTasks'>
                                {
                                exercises.length !== 0 && exercises[0].username !== "" ? 
                                Object.entries(exercises).slice(offset, offset + PER_PAGE)
                                    .map(([key, value]) => {
                                        return (
                                            <div key={key} className="HomeTask">
                                                <Button colorScheme={'linkedin'} size="lg" className='taskButtons' key={key} onClick={() => showToastWithButton(value.description)
                                                } style={{
                                                    height:"12vh"
                                                }}> BY : {value.username} <br /> {value.name} </Button>
                                            </div>
                                        );
                                    })
                                    :
                                    <div className='HomeTask'>
                                    </div>
                                    }
                            </div>
                            <ReactPaginate
                                previousLabel={""}
                                nextLabel={""}
                                pageCount={pageCount}
                                onPageChange={handlePageClick}
                                containerClassName={"pagination"}
                                previousLinkClassName={"pagination__link"}
                                nextLinkClassName={"pagination__link"}
                                disabledClassName={"pagination__link__disabled"}
                                activeClassName={"pagination__link--active"}
                            />
                    </div>
                    <div className='HomeBottomRight'>

                    </div>
                </div>
            </div>   
            <Toaster /> 
        </div>
    )
}
export default Home