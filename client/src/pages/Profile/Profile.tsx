import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import './Profile.css'
import ReactPaginate from 'react-paginate';
import { Button, ButtonGroup } from "@chakra-ui/button"
import NoteBook from '../../assets/NoteBook.png'
import Share from '../../assets/share.png'
import toast, { Toaster } from 'react-hot-toast'
import home from '../../assets/home.png'
import user from '../../assets/user.png'
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';


const Profile: React.FC = () => {


    
    const [username, setUsername] = useState("");
    const [exercises, setExercises] = useState([{
        name: "", description: ""
    }]);
    const [name, setName] = useState("");
    const [modifiedName, setModifiedName] = useState("");
    const [description, setDescription] = useState("");
    const [modifiedDescription, setModifiedDescription] = useState("");
    const [selectedOption, setSelectedOption] = useState("");
    const [task_name, setTask_name] = useState("");
    const [sharedExercises, setsharedExercises] = useState([{
        name: "", description: ""
    }])
    const [isLoading, setLoading] = useState(true);

    const navigate = useNavigate();

    const [currentPage, setCurrentPage] = useState(0)
    const PER_PAGE = 3
    const offset = currentPage * PER_PAGE;
    const pageCount = Math.ceil(exercises.length / PER_PAGE);
    const sharedPageCount = Math.ceil(sharedExercises.length / PER_PAGE);
    
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
                <Button size={'sm'} colorScheme="red" onClick={dismissToast} style={{ alignSelf: 'center' }}>Dismiss</Button>
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



    const fetchData_Username = async (): Promise<void> => {

        const token = await localStorage.getItem("token")

        try {
            const data = await fetch("/api/GetUsername", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ token }),
            })
            await data.text()
            .then((e) => {
                setUsername(e.valueOf())
            })
        }
        catch (e) {
            console.log(e)
            navigate("/Login")
        }
    }

    const fetchData_Exercises = async (): Promise<any> => {

        const token = await localStorage.getItem("token")


        try {
            const data = await fetch("/api/GetExercises", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ token }),
            })
            const response = await data.text()
            if(response.valueOf() !== "[]"){
                const e = JSON.parse(response.valueOf())
                setExercises(e)
            }
            setLoading(false)
        }
        catch (e) {
            console.log(e)
        }

    }
    const fetchData_SharedExercises = async (): Promise<any> => {

        const token = await localStorage.getItem("token")


        try {
            const data = await fetch("/api/GetUserSharedExercises", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ token }),
            })
            const response = await data.text()
            if (response.valueOf() !== "[]") {
                const e = JSON.parse(response.valueOf())
                setsharedExercises(e)
            }
            setLoading(false)
        }
        catch (e) {
            console.log(e)
        }

    }

    useEffect(() => {
        fetchData_Username()
        .then( () => fetchData_Exercises())
        .then( () => fetchData_SharedExercises())
    }, [])

    const handleShare = async (event: any) => {
        event.preventDefault();
        try
        {
            await fetch("/api/shareTask", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ selectedOption, username }),
            })

            return window.location.reload();
        }
        catch(e){
            
        }

    }
    const handleStopSharing = async (valueName: any) => {

        await fetch("/api/StopSharing", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ valueName, username }),
        })

        return window.location.reload();
    }

    const handleSubmit_Add = async (event: any) => {
        event.preventDefault();

        await fetch("/api/saveTask", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, description, username }),
        })
        
        return window.location.reload();
    }
    const handleModify = async (event: any) => {

        event.preventDefault()
        
            await fetch("/api/modifyTask", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ modifiedName, modifiedDescription, task_name, username }),
            })

            return window.location.reload();
    }
    const handleDelete = async (valueName: any) => {

        await fetch("/api/DeleteTask", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({valueName, username}),
        })

        return window.location.reload();

    }

    const weekday = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const monthShortNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const date = new Date();

    return (
        isLoading ? 
        <div>
            Loading
        </div>  
        :
        <div className='profilePage'>
                
                <div className='profileMenu'>
                    <Button colorScheme={"white"} style={{ marginBottom: '20%' }} onClick={() => navigate("/")}><img src={home} alt="home icon" /> </Button>
                    <Button colorScheme={"white"} onClick={() => navigate("/Profile") }><img src={user} alt="user icon" /></Button>
                </div>
                <div className='profileMain'>

                    <div className='profileTopContainer'>

                        <div className='profileTopContainer-left'>
                            <p> {monthShortNames[date.getMonth()]} {date.getDate()},{date.getFullYear()} {weekday[date.getDay()]}</p>
                            <div className='profile-welcome-text'>
                                <h2 style={{ fontSize: "calc(0.7vw + 1.7vh + 1.1vmin)"}}>My Workspace</h2>
                                <p style={{ color: "grey" }}>welcome {username} you look great today!</p>
                            </div>
                                <ButtonGroup id='profile-buttons-div'>
                                <Popup trigger={<Button id='profile-button' leftIcon={<img src={NoteBook} alt='Add Task Icon' className='icon' />}>Add Task</Button> } modal>   

                                    <form onSubmit={handleSubmit_Add} className='form'>
                                        <label>
                                            Name:
                                        </label>
                                            <input
                                                type="text"
                                                value={name}
                                                onChange={(event) => setName(event.target.value)}
                                                required
                                            />
                                        <br />
                                        <label>
                                            Description:
                                        </label>
                                            <textarea
                                                value={description}
                                                onChange={(event) => setDescription(event.target.value)}
                                                required
                                            />
                                        <br />
                                        <Button colorScheme={'green'} size={'lg'} style={{ alignSelf: 'center', marginTop: "3%", fontSize: "1.5em" }} type="submit">Submit</Button>
                                    </form>
                                
                                 </Popup>
                                <Popup trigger={<Button  id='profile-button' leftIcon={<img src={Share} alt="Share Icon" className='icon' />}>Share</Button>} modal>

                                    <form onSubmit={handleShare} className="shareForm">
                                        <label>
                                            Which one would you like to share: 
                                        </label>
                                            <select value={selectedOption} onChange={e => setSelectedOption(e.target.value)}>
                                            <option>Please Select The Task You Want To Share</option>
                                                {exercises.map(option => (
                                                    <option  value={option.name}>
                                                        {option.name}
                                                    </option>
                                                ))}
                                            </select>
                                        <Button type="submit" size={'lg'} style={{alignSelf: "center", fontSize: "1.5em"}} colorScheme="green">Share</Button>
                                    </form>

                                </Popup>
                                </ButtonGroup>
                        
                        </div>

                        <div className='profileTopContainer-right'>
                            <p>@{username}</p>
                        </div>

                    </div>

                    <div className='profileBottomContainer'>
                        <div className='profileBottomContainer-left'>
                            <Tabs style={{minHeight: '400px'}}> 
                                <TabList>
                                    <Tab> <h1 className='profileBottomContainer-left-text'>Your Assignments</h1> </Tab>
                                    <Tab> <h1 className='profileBottomContainer-left-text'>Shared Assignments</h1> </Tab>
                                </TabList>
                            <TabPanel>
                                <div className='profileBottomContainer-left-tasks'>
                                    {
                                        exercises.length !== 0 && exercises[0].name !== "" ?
                                            Object.entries(exercises).slice(offset, offset + PER_PAGE)
                                                .map(([key, value]) => {
                                                    return (
                                                        <div key={key}>
                                                            <Button colorScheme={'whatsapp'} size="lg" className='taskButtons' onClick={() => showToastWithButton(value.description)
                                                            }>{value.name}</Button>
                                                            <div className='modify-delete-buttons-div'>
                                                                <Button size={'xs'} colorScheme='red' onClick={() => handleDelete(value.name)}>DELETE</Button>
                                                                <Popup trigger={<Button size={'xs'} colorScheme='yellow' onClickCapture={() => {
                                                                    setModifiedDescription(value.description)
                                                                    setModifiedName(value.name)
                                                                    setTask_name(value.name)
                                                                }
                                                                }>MODIFY</Button>} modal>
                                                                    <form onSubmit={
                                                                        handleModify} className='form'>
                                                                        <label>
                                                                            Name:
                                                                        </label>
                                                                        <input
                                                                            type="text"
                                                                            value={modifiedName}
                                                                            onChange={(event) => setModifiedName(event.target.value)}
                                                                            required
                                                                        />
                                                                        <br />
                                                                        <label>
                                                                            Description:
                                                                        </label>
                                                                        <textarea
                                                                            value={modifiedDescription}
                                                                            onChange={(event) => setModifiedDescription(event.target.value)}
                                                                            required
                                                                        />
                                                                        <br />
                                                                        <Button colorScheme={'green'} size={'lg'} style={{ alignSelf: 'center', marginTop: "3%", fontSize: "1.5em" }} type="submit">Submit</Button>
                                                                    </form>
                                                                </Popup>
                                                            </div>
                                                        </div>
                                                    );
                                                })
                                            :
                                            <div>

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
                            </TabPanel>
                            <TabPanel>
                                    <div className='profileBottomContainer-left-tasks'>
                                        {
                                            sharedExercises.length !== 0 && sharedExercises[0].name !== "" ?
                                                Object.entries(sharedExercises).slice(offset, offset + PER_PAGE)
                                                    .map(([key, value]) => {
                                                        return (
                                                            <div key={key}>
                                                                <Button colorScheme={'whatsapp'} size="lg" className='taskButtons' onClick={() => showToastWithButton(value.description)
                                                                }>{value.name}</Button>
                                                                <div className='modify-delete-buttons-div'>
                                                                    <Button size={'xs'} colorScheme='red' onClick={() => handleStopSharing(value.name)}>Stop Sharing</Button>              
                                                                </div>
                                                            </div>
                                                        );
                                                    })
                                                :
                                                <div>

                                                </div>
                                        }
                                    </div>
                                    <ReactPaginate
                                        previousLabel={""}
                                        nextLabel={""}
                                        pageCount={sharedPageCount}
                                        onPageChange={handlePageClick}
                                        containerClassName={"pagination"}
                                        previousLinkClassName={"pagination__link"}
                                        nextLinkClassName={"pagination__link"}
                                        disabledClassName={"pagination__link__disabled"}
                                        activeClassName={"pagination__link--active"}
                                    />
                            </TabPanel>
                        </Tabs>
                        </div>
                        <div className='profileBottomContainer-right'>
                            
                        </div>
                    </div>
                    <Toaster />
                </div>
        </div>

    )
    
}
export default Profile