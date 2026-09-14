'use client'
import axios from "axios";
import {useState} from "react";

export default function Login(props)  {
    const onLoginSuccess = props.onLoginSuccess;
    const [id, setId] = useState();
    const [pw, setPw]= useState();

    const subMit = fucntion () {
        e.preventDefault()
        axios.post('http://localhost/member/login', {id, pw}).then
    }

    return (
        <div>
            <form onSubmit={()=>{}}>
                <input value={id} onChange={}></input>
                <input type="password" value={pw} onChange={}></input>
                <button type="submit"></button>
            </form>
        </div>

    );
}