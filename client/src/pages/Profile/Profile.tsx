import React, { useEffect, useState } from 'react'
import { NavigateFunction, useNavigate } from 'react-router-dom';

const Profile: React.FC = () => {

    const [username, setUsername] = useState("");
    const [exercises, setExercises] = useState([{
        name: "", description: ""
    }]);
    const [isLoading, setLoading] = useState(true);
    
    const navigate = useNavigate();

    const fetchData_Username = async (): Promise<void> => {

        const token = await localStorage.getItem("token")

        try {
            const data = await fetch("/api/GetUsername", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ token }),
            })
            const respone = await data.text()
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
                console.log(e)
                setExercises(e)
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
    }, [])

    return (
        isLoading ? 
        <div>
            Loading
        </div>  
        :
        <div>
            <p>username : {username}</p>
                {Object.entries(exercises).map(([key, value]) => {
                    return (
                        <div key={key}>
                            <p>{value.name}</p>
                            <p>{value.description}</p>
                        </div>
                    );
                })}
        </div>
    )
    
}
export default Profile