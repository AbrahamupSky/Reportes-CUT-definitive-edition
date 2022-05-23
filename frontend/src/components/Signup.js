import React, { useState } from 'react'
import { Redirect } from "react-router-dom"
import background from "../images/try.svg";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons'

const API = process.env.REACT_APP_API;

export const Signup = () => {
    const [nombre, setNombre] = useState('')
    const [codigo, setCodigo] = useState('')
    const [email, setEmail] = useState('')
    const [contraseña, setContraseña] = useState('')
    const [rol, setRol] = useState(0)
    const em = sessionStorage.getItem("email")

    const handelSubmit = async (e) => {
        e.preventDefault()

        const res = await fetch(`${API}/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                codigo: codigo,
                nombre: nombre,
                email: email,
                contraseña: contraseña,
                role: rol,
                Status: "Denegado"
            })
        })
        const data = await res.text()
        if (res.status === 200) {
            window.alert(data);
            window.location.href = "/"
        } else {
            window.alert(data);
        }


    }

    return (
        <div>
            {em && em !== "" && em !== undefined ? <Redirect to="/index" /> : <div className="container" style={{ backgroundImage: `url(${background})`, backgroundSize: '100%', height: '85vh', backgroundRepeat: 'no-repeat', }}>
                <div className="m-5 p-4 d-flex justify-content-center align-items-center " style={{ width: '80%' }}>
                    <form onSubmit={handelSubmit} className="row border border border-dark m-3 p-5 rounded" style={{ background: 'white' }}>

                        <div className="col-md-6">
                            <label htmlFor="inputName" className="form-label">Nombre Completo</label>
                            <input
                                type="text"
                                onChange={e => setNombre(e.target.value)}
                                className="form-control"
                                placeholder="Nombre completo"
                                id="inputName" required />
                        </div>

                        <div className="col-md-6">
                            <label htmlFor="inputCode" className="form-label">Codigo</label>
                            <input
                                type="text"
                                onChange={e => setCodigo(e.target.value)}
                                className="form-control"
                                placeholder="Codigo"
                                id="inputCode" required />
                            <br />
                        </div>

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
                            <label htmlFor="inputPassword" className="form-label">Contraseña</label>
                            <input
                                type="password"
                                onChange={e => setContraseña(e.target.value)}
                                className="form-control"
                                placeholder="Contraseña"
                                id="inputPassword" required />
                        </div>

                        <div className="col-md-6">

                            <label htmlFor="exampleSelect1" className="form-label mt-4 ">Especifica tu(s) rol(es)</label>
                          
                          <form defaultValue='Denegado' id="exampleSelect1" onClick={e => setRol(e.target.value)} required>
                            <input type="checkbox"  value="1" name="checkbox[]"/>Jefe de Departamento
                                <br /><input type="checkbox"  value="2" name="checkbox[]"/>Maestro
                                <br /> <input type="checkbox"  value="3" name="checkbox[]"/>Presidente de Academia (Ingenieria de Software)
                               <br/><br/> <input type="button" value="Mostrar" className="btn btn-primary" onClick="contarSeleccionados()"/>
                           </form>
                        </div>
                        
                    <div className="col-md-6">
                        <br /> <input type="checkbox"  value="4" name="checkbox[]"/>Presidente de Academia (Programacion Avanzada)
                        <br /> <input type="checkbox"  value="5" name="checkbox[]"/>Presidente de Academia (Gestion de Datos)
                        <br /> <input type="checkbox"  value="6"name="checkbox[]"/>Presidente de Academia (Gestion De Tecnologias De La Informacion)  
                    </div>
                     


                        <div className="text-center mt-4">
                            <button style={{ width: '60%' }} type="submit" className="btn btn-primary">Registrarse</button>
                        </div>

                    </form>

                </div>
            </div>
            }
        </div>
    )



}