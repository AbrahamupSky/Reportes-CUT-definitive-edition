import user from '../images/user.svg';
import React, { useState } from 'react';

const API = process.env.REACT_APP_API;

export const Profile = () => {

    const id = sessionStorage.getItem("id")

    const [nombre, setNombre] = useState('')
    const [codigo, setCodigo] = useState('')
    const [correo, setCorreo] = useState('')
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
        if (data.role === 1) {
            return setRol('Jefe de Departamento')
        } else
            return setRol('Maestro')

    }


    return (
        <div onLoad={getProfile} className="container mt-5">
            <div className="d-flex justify-content-center align-items-center">
                <div style={{ width: '550px' }} className="card border-dark mb-3 rounded p-4" >
                    <img style={{ height: '200px' }} src={user} className="card-img-top" alt="..." />
                    <div className="card-body">
                        <h5 className="card-title text-center">Datos de la Cuenta</h5>
                        <div className="form-group">
                            <fieldset>
                                <label className="form-label mt-4" htmlFor="readOnlyInput">Nombre Completo</label>
                                <input className="form-control" value={nombre} id="readOnlyInput" type="text" placeholder="Readonly input here..." readOnly />
                            </fieldset>
                        </div>
                        <div className="form-group">
                            <fieldset>
                                <label className="form-label mt-2" htmlFor="readOnlyInput">Codigo UdG</label>
                                <input className="form-control" value={codigo} id="readOnlyInput" type="text" placeholder="Readonly input here..." readOnly />
                            </fieldset>
                        </div>
                        <div className="form-group">
                            <fieldset>
                                <label className="form-label mt-2" htmlFor="readOnlyInput">Email</label>
                                <input className="form-control" value={correo} id="readOnlyInput" type="text" placeholder="Readonly input here..." readOnly />
                            </fieldset>
                        </div>
                        <div className="form-group">
                            <fieldset>
                                <label className="form-label mt-2" htmlFor="readOnlyInput">Rol</label>
                                <input className="form-control" value={rol} id="readOnlyInput" type="text" placeholder="Readonly input here..." readOnly />
                            </fieldset>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Profile
