import React, { useState } from 'react'
import { Redirect } from "react-router-dom"
import background from "../images/try.svg";

const API = process.env.REACT_APP_API;

export const Recovery_Pass = (props) => {


    const [email, setEmail] = useState('')
    const em = sessionStorage.getItem("email")

//console.log()
    const getPass = async (e) => {
        e.preventDefault()
        const opts = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: email,
            })
        };

        const ema = await fetch(`${API}/recovery_Pass`, opts)
        const data = await ema.json()
         if (ema.status === 200){
            
         window.location.href = "/ChangePass"
       }else{
        window.alert(data);
    }
    

}
    return (
        <div>
            {em && em !== "" && em !== undefined ? <Redirect to="/index" /> : <div className="container" style={{ backgroundImage: `url(${background})`, backgroundSize: '100%', height: '85vh', backgroundRepeat: 'no-repeat', }}>
                <div className="m-5 p-4 d-flex justify-content-center align-items-center " style={{ width: '80%' }}>
                    <form onSubmit={getPass} className="row border border border-dark m-3 p-5 rounded" style={{ background: 'white' }}>


                        <div className="col-md-6">
                            <label htmlFor="inputEmail" className="form-label">Email</label>
                            <input
                                type="email"
                                onChange={e => setEmail(e.target.value)}
                                className="form-control"
                                placeholder="Correo Institucional"
                                id="inputEmail" required />
                        </div>


                        <div className="text-center mt-4">
                            <button style={{ width: '60%' }} type="submit" className="btn btn-primary">Recuperar Contraseña</button>
                        </div>

                    </form>

                </div>
            </div>
            }
        </div>
    )
}