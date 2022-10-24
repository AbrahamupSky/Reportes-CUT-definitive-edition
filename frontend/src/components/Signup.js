import React, { useState } from 'react'
//import { Redirect } from "react-router-dom"
import background from "../images/try.svg";


const API = process.env.REACT_APP_API;

export const Signup = () => {
    const [nombre, setNombre] = useState('')
    const [codigo, setCodigo] = useState('')
    const [email, setEmail] = useState('')
    const [contraseña, setContraseña] = useState('')
    const [rol, setRol] = useState(0)
    const [areasActive,setareasActive] = useState(false)
    const [form1Active,setForm1Active] = useState(false)
    const [form2Active,setForm2Active] = useState(false)
    const rol1 = sessionStorage.getItem("Rol")


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
                status: "Denegado"
               
            })
        })
        const data = await res.text()
        if (res.status === 200){
            window.swal(data, '', 'success');
            window.location.href = "/"
        }else{
            window.swal(data, '', 'error');
        }


    }

    function selectArea(){
        var f = document.getElementById("exampleSelect1")  

        if(f.value ==="10"){
            setareasActive(!areasActive)
        }else if(areasActive){
            setareasActive(!areasActive)
            
        }  
    }

    //em && em !== "" && em !== undefined ? <Redirect to="/index" /> :
    return (
        <div>
            {<div className="container" style={{ backgroundImage: `url(${background})`, backgroundSize: '100%', height: '85vh', backgroundRepeat: 'no-repeat', }}>
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
                        {rol1 === "1" && !form1Active? setForm1Active(!form1Active):
                        form1Active && <div className="col-md-6">
                            <label htmlFor="exampleSelect1" className="form-label mt-4">Especifica el rol</label>
                            <select onChangeCapture={selectArea} defaultValue='0' className="form-select" id="exampleSelect1" onClick={e => setRol(e.target.value)} required>
                                <option value='0'>Escoge una opcion</option>
                                <option value='1'>Jefe de Departamento</option>
                                <option value='2'>Maestro</option>
                                <option value='10'>Presidente de academia</option>
                            </select>
                        </div>
                        }
                        {rol1 === "3" && !form2Active? setForm2Active(!form2Active):
                        form2Active && <div className="col-md-6">
                            <label htmlFor="exampleSelect3" className="form-label mt-4">Especifica el rol</label>
                            <select defaultValue='2' className="form-select" id="exampleSelect3" onClick={e => setRol(e.target.value)} required>
                                <option value='2'>Maestro</option>
                            </select>
                        </div>
                        } 
                        {
                        areasActive && <div className="col-md-6">
                            <label htmlFor="exampleSelect2" className="form-label mt-4">Especifica el area</label>
                            <select defaultValue='0' className="form-select" id="exampleSelect2" onClick={e => setRol(e.target.value)} required>
                                <option value='0'>Escoge una opcion</option>
                                <option value='3'>Ingenieria de Software</option>
                                <option value='4'>Programacion Avanzada</option>
                                <option value='5'>Gestion de datos</option>
                                <option value='6'>Gestion De Tecnologias De Informacion</option>
                            </select>
                        </div>
                        }
                    

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