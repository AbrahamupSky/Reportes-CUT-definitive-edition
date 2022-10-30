import user from '../images/user.svg';
import React, { useState } from 'react';

const API = process.env.REACT_APP_API;

export const Profile = () => {

    const id = sessionStorage.getItem("id")

    const [nombre, setNombre] = useState('')
    const [codigo, setCodigo] = useState('')
    const [correo, setCorreo] = useState('')
    const [Status, setStatus] = useState('')
    const [rol, setRol] = useState('')

    const getProfile = async () => {

        const opts = {
            method: 'POST',
            mode: 'cors',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                codigo: id,
            })
        };

        const res = await fetch(`${API}/profile`, opts)
        const data = await res.json()
 
        setNombre(data.fullName)
        setCodigo(data.codeUDG)
        setCorreo(data.email)
        setStatus(data.Status)
        if (data.role === 1) {
            return setRol('Jefe de Departamento')
        } else if (data.role === 2) {
            return setRol('Maestro')
        } else if (data.role === 3) {
            return setRol('Presidente de Academia (Ingenieria de Software)')
        } else if (data.role === 4) {
            return setRol('Presidente de Academia (Programacion Avanzada)')
        } else if (data.role === 5) {
            return setRol('Presidente de Academia (Gestion de datos)')
        } else {
            return setRol('Presidente de Academia (Gestion De Tecnologias De Informacion)')
        }
    }


    return (
        <div onLoad={getProfile} className="container mt-2">
            <div className="d-flex justify-content-center align-items-center">
                <div style={{ width: '600px' }} className="card border-dark mb-3 rounded p-4" >
                    <img style={{ height: '200px' }} src={user} className="card-img-top" alt="..." />
                    <div className="card-body">
                        <h5 className="card-title text-center">Datos del Usuario</h5>
                        <div className="form-group">
                            <fieldset>
                                <label className="form-label mt-4" htmlFor="readOnlyInput">Nombre Completo</label>
                                <input className="form-control" value={nombre} id="readOnlyInput" type="text" placeholder="Readonly input here..." readOnly />
                            </fieldset>
                        </div>
                        <div className="form-group">
                            <fieldset>
                                <label className="form-label mt-2" htmlFor="readOnlyInput">Codigo UdeG</label>
                                <input className="form-control" value={codigo} id="readOnlyInput" type="text" placeholder="Readonly input here..." readOnly />
                            </fieldset>
                        </div>
                        <div className="form-group">
                            <fieldset>
                                <label className="form-label mt-2" htmlFor="readOnlyInput">Correo</label>
                                <input className="form-control" value={correo} id="readOnlyInput" type="text" placeholder="Readonly input here..." readOnly />
                            </fieldset>
                        </div>
                        <div className="form-group">
                            <fieldset>
                                <label className="form-label mt-2" htmlFor="readOnlyInput">Rol</label>
                                <input className="form-control" value={rol} id="readOnlyInput" type="text" placeholder="Readonly input here..." readOnly />
                            </fieldset>
                        </div>
                        <div className="form-group">
                            <fieldset>
                                <label className="form-label mt-4" htmlFor="readOnlyInput">Status</label>
                                <input className="form-control" value={Status} id="readOnlyInput" type="text" placeholder="Readonly input here..." readOnly />
                            </fieldset>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Profile
