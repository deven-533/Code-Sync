import React, { useEffect, useState } from 'react'
import Member from '../components/Member'
import img from '../assets/head.png'
import axios from "axios";
import io from 'socket.io-client'
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast'




const socket = io.connect('http://localhost:3001')


const IDE = () => {
    const navigatortemp = useNavigate()
    const [Input, setInput] = useState("");
    const [Output, setOutput] = useState("");
    const [Code, setCode] = useState("");
    const [Client, setClient] = useState([]);
    const location = useLocation();
    const id = window.location.href.split('/')[4]
    const data = {
        code: Code,
        input: Input,


    }



    const leaveRoom = () => {
        socket.emit('leave-room', { id, CurrUser: location.state?.userName })
        {
            socket.on('disconnected-user', (data) => {
                toast.success(`${data.CurrUser} Disconnected from the Room`)
            })
        }
        navigatortemp('/')
    }
    if (!location.state) {
        navigatortemp('/')
    }

    async function copyRoomId() {
        try {
            await navigator.clipboard.writeText(id);
            toast.success('Room ID Copied to Clipboard');
        } catch (err) {
            toast.error('Could not copy the Room ID');
            console.error(err);
        }
    }


    const RunHandler = () => {
        axios.post("http://localhost:3001/compilecode", data)
            .then((res) => {
                setOutput(res.data.output)
            })
            .catch((err) => {
                console.log(err);
                setOutput(err)
            })



    }
    const clientusers = [];
    const CurrUser = location.state?.userName;
    const CurrMe = { user: location.state?.userName }
    clientusers.push(CurrMe)




    useEffect(() => {
        socket.emit('join-room', { id, CurrUser })
        if (CurrUser) {
            toast.success(`Welcome ${location.state?.userName} to the Room`)
        }
        socket.on('connected-user', (data) => {
            clientusers.push({ user: data.CurrUser })
            toast.success(`${data.CurrUser} Connected to the Room`)
        })



    }, [
        CurrUser
    ])

    useEffect(() => {
        const message = { output: Output }
        socket.emit('sync-output', { message, id })
        socket.on('sync-output-server', (message) => {
            setOutput(message.message.output)
        }
        )


    }, [Output])

    useEffect(() => {
        socket.emit('sync-code-input', { data, id })
        socket.on('sync-code-input-server', (data) => {
            setCode(data.data.code)
            setInput(data.data.input)
        })

    }, [Code, Input])
    return (
        <div className='container'>
            <div className="mainWrap">
                <div className="aside">
                    <div className="asideInner">
                        <div className="logo">
                            <img
                                className="logoImage"
                                src={img}
                                alt="logo"
                            />
                        </div>
                        <h2>Connected</h2>
                        <div className="clientsList">
                            <Member username={CurrUser} />
                        </div>
                    </div>
                    <button className="btn copyBtn" onClick={copyRoomId}>
                        Copy Room ID
                    </button>
                    <button className="btn leaveBtn" onClick={leaveRoom}>
                        Leave
                    </button>
                </div>

            </div>
            <div className='code'>
                <div className='control'>
                    <button className='run' onClick={RunHandler}>Run</button>
                </div>
                <textarea className='codeide' value={Code} onChange={(e) => { setCode(e.target.value); }}></textarea>
            </div>
            <div><div className="inpout">

                <div className="inp">
                    <h3 >Input</h3>
                    <textarea onChange={(e) => { setInput(e.target.value); }} value={Input} name="input" id="input" cols="30" rows="10"></textarea>
                </div>

                <div className="out">
                    <h3>Output</h3>
                    <textarea disabled onChange={(e) => { setOutput(e.target.value); }} value={Output} name="output" id="output" cols="30" rows="10"></textarea>
                </div>
            </div>
            </div>

        </div>
    )
}

export default IDE