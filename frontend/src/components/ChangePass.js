import React, { useState } from 'react'
import { Redirect } from "react-router-dom"
import background from "../images/try.svg";

const API = process.env.REACT_APP_API;

export const ChangePass = (props) => {


    const [email, setEmail] = useState('')
    const [contraseña, setContraseña] = useState('')
    const [token, setToken] = useState('')
    const em = sessionStorage.getItem("email")

//console.log()
    const ChaPass = async (e) => {
        e.preventDefault()
        const opts = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: email,
                contraseña: contraseña,
                token: token,
            })
        };

        const ema = await fetch(`${API}/changePs`, opts)
        const data = await ema.json()
         if (ema.status === 200){
        window.alert('Contraseña actualizada');
      
       }else{
        window.alert(data);
    }
    

}
    return (
        <div>
            {em && em !== "" && em !== undefined ? <Redirect to="/index" /> : <div className="container" style={{ backgroundImage: `url(${background})`, backgroundSize: '100%', height: '85vh', backgroundRepeat: 'no-repeat', }}>
                <div className="m-5 p-4 d-flex justify-content-center align-items-center " style={{ width: '80%' }}>
                    <form onSubmit={ChaPass} className="row border border border-dark m-3 p-5 rounded" style={{ background: 'white' }}>


                        <div className="col-md-6">
                            <label htmlFor="inputEmail" className="form-label">Email</label>
                            <input
                                type="email"
                                onChange={e => setEmail(e.target.value)}
                                className="form-control"
                                placeholder="Correo Institucional"
                                id="inputEmail" required />
                        </div>
                        <div className="col-md-6">
                            <label htmlFor="inputPassword" className="form-label">token</label>
                            <input
                                type="password"
                                onChange={e => setToken(e.target.value)}
                                className="form-control"
                                placeholder="Introduce tu token aqui"
                                id="inputToken" required />
                        </div>
                        <div className="col-md-6">
                            <label htmlFor="inputPassword" className="form-label">Nueva contraseña</label>
                            <input
                                type="password"
                                onChange={e => setContraseña(e.target.value)}
                                className="form-control"
                                placeholder="Introduce tu nueva contraseña aqui"
                                id="inputPassword" required />
                        </div>

                        <div className="text-center mt-4">
                            <button style={{ width: '60%' }} type="submit" className="btn btn-primary">Cambiar Contraseña</button>
                        </div>

                    </form>

                </div>
            </div>
            }
        </div>
    )
}