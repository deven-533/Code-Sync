import React, { useState } from 'react'
import '../App.css'
import { v4 as generator } from 'uuid'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-hot-toast'

const Home = () => {
    const navigate = useNavigate();
    const [roomID, setRoomID] = useState('')
    const [userName, setUserName] = useState('')
    const joinRoom = () => {
        if (!roomID || !userName) {
            return toast.error('Please enter both fields')
        }
        navigate(`/room/${roomID}`, {
            state: { userName }
        })
    }
    const createNewRoom = (e) => {
        e.preventDefault();
        const id = generator();
        setRoomID(id);
        toast.success('Created a new room');
    };

    const handleInputEnter = (e) => {
        if (e.code === 'Enter') {
            joinRoom();
        }
    };


    return (
        <div className='Homebody'>
            <div className="homePageWrapper">
                <div className="formWrapper">
                    <h1
                        className="homePageLogo"
                    >
                        Code-Sync
                    </h1>
                    <div className="inputGroup">
                        <input
                            type="text"
                            className="inputBox"
                            placeholder="Room ID"
                            onChange={(e) => setRoomID(e.target.value)}
                            value={roomID}
                            onKeyUp={handleInputEnter}

                        />
                        <input
                            type="text"
                            className="inputBox"
                            placeholder="User Name"
                            onChange={(e) => setUserName(e.target.value)}
                            value={userName}
                            onKeyUp={handleInputEnter}


                        />
                        <button className="btn joinBtn"
                            onClick={joinRoom}>
                            Join
                        </button>
                        <span className="createInfo">
                            If you don't have an invite then create &nbsp;
                            <a
                                href=""
                                onClick={createNewRoom}
                                className="createNewBtn"
                            >
                                New Room
                            </a>
                        </span>
                    </div>
                </div>
                <footer>
                    <h4>
                        Made with ❤️ by -
                        Deven Nehete
                    </h4>
                </footer>
            </div>
        </div>
    )
}

export default Home