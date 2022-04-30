import { Redirect } from "react-router-dom"
import React, { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFileAlt } from '@fortawesome/free-solid-svg-icons'

const API = process.env.REACT_APP_API;

export const ViewFiles = () => {

    const rol = sessionStorage.getItem("Rol")
    const temp = sessionStorage.getItem("Temp")
    const [teachers, setTeachers] = useState([])
    const [code, setCode] = useState('')

    const getTeacher = async (codigo) => {
        const opts = {
            method: 'GET',
            mode: 'cors',
            credentials: 'include',
        };

        if (temp && temp !== "" && temp !== undefined) {
            const res = await fetch(`${API}/view/${temp}`, opts)
            const data = await res.json();
            setTeachers(data)
            sessionStorage.removeItem('Temp')
            document.getElementById('Codigo').value = ''
        }else{
            const res = await fetch(`${API}/view/${codigo}`, opts)
            const data = await res.json();
            setTeachers(data)
        }

    }


    return (
        <div>
            {rol === "2" ? <Redirect to="/index" /> :
                <div className="container" style={{ maxWidth: '99vw' }}>

                    <div className="m-5">

                        <div className="input-group mb-3" style={{ maxWidth: '20vw' }}>
                            <input onChange={(e) => setCode(e.target.value)} type="text" className="form-control" placeholder="Codigo" aria-label="Codigo" value={temp} id="Codigo" aria-describedby="button-addon2" />
                            <button onClick={() => getTeacher(code)} className="btn btn-primary" type="button" id="button-addon2">Buscar</button>
                        </div>


                        <table className="table table-bordered">
                            <thead className="bg-primary text-white">
                                <tr>
                                    <th scope="col">id</th>
                                    <th scope="col">Academia</th>
                                    <th scope="col">Materia</th>
                                    <th scope="col">Tipo de Evidencia</th>
                                    <th scope="col">Turno</th>
                                    <th scope="col">Nombre del Archivo</th>
                                    <th scope="col">Ver</th>
                                </tr>
                            </thead>
                            <tbody>
                                {teachers.map(user => (
                                    <tr key={user.id}>
                                        <td>{user.id}</td>
                                        <td>{user.academyName}</td>
                                        <td>{user.courseName}</td>
                                        <td>{user.evidenceType}</td>
                                        <td>{user.shift}</td>
                                        <td>{user.fileName}</td>
                                        <td><button onClick={() => window.open(`${API}/fileView/${user.id}`, '_blank')} className="btn btn-warning btn-sm text-primary"><FontAwesomeIcon icon={faFileAlt} /></button></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                    </div>

                </div>
            }
        </div>
    )
}

export default ViewFiles
