import React, { useEffect, useState } from 'react'

const Profile: React.FC = () => {

    const [username, setUsername] = useState("");
    const [exercises, setExercises] = useState([]);
    

    useEffect(() => {
        const fetchData = async (): Promise<any> => {
            try
            {
                const data = await fetch("/api/GetUserData");
            }
            catch(e)
            {

            }
        }
    })

    return (
        <div>
            Profile
        </div>
    )
}
export default Profile