import { Redirect } from "react-router-dom"
import React, { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFileAlt } from '@fortawesome/free-solid-svg-icons'

const API = process.env.REACT_APP_API;
Object.filter = function(mainObject, filterFunction){
    return Object.keys(mainObject)
          .filter( function(ObjectKey){
              return filterFunction(mainObject[ObjectKey])
          } )
          .reduce( function (result, ObjectKey){
              result[ObjectKey] = mainObject[ObjectKey];
              return result;
            }, {} );
}
const filterAcademy = ( academies, rol) => {
    let academy
    console.log(rol)
    if (rol === '3') {
        academy = 'Ingenieria de Software'
    } else if (rol === '4') {
        academy = 'Programacion Avanzada'
    } else if (rol === '5') {
        academy = 'Gestion de datos'
    }else if (rol === '6') {
        academy = 'Gestion De Tecnologias De Informacion'
    }else if (rol === '1') {
        return academies
    }
    var targetSubjects = Object.filter(academies, function(acade){
        return acade.academyName === academy;
    });
    return targetSubjects
      // return academies
}

export const ViewFiles = () => {

    const rol = sessionStorage.getItem("Rol")
    const temp = sessionStorage.getItem("Temp")
    const [teachers, setTeachers] = useState([])
    const [code, setCode] = useState('')
    const [codigo, setCodigo] = useState('')

    const getTeacher = async (codigo) => {
        const opts = {
            method: 'GET',
            mode: 'cors',
            credentials: 'include',
        };

        if (temp && temp !== "" && temp !== undefined) {
            const res = await fetch(`${API}/view/${temp}`, opts)
            let data = await res.json();
            data = filterAcademy(data, rol )
            setTeachers(Object.values(data))
            sessionStorage.removeItem('Temp')
            document.getElementById('Codigo').value = ''
        }else{
            const res = await fetch(`${API}/view/${codigo}`, opts)
            let data = await res.json();
            data = filterAcademy(data, rol)
            setTeachers(Object.values(data))
        }

    }

    const getAllFiles = async () => {
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
            const res = await fetch(`${API}/view/`, opts)
            const data = await res.json();
            setTeachers(data)
        }

    }

    const MiComponente = function (props) {
        const rol = sessionStorage.getItem("Rol")
        if (rol === '1') { 
            return (
                <div className="input-group mb-3" style={{ maxWidth: '20vw' }}>
                    <button onClick={() => getAllFiles()} className="btn btn-primary" type="button" id="button-addon2">Mostrar todos</button>
                </div>
            );
        }
        else
            return ('');
       };


    return (
        <div>
            {rol === "2" ? <Redirect to="/index" /> :
                <div className="container" style={{ maxWidth: '99vw' }}>

                    <div className="m-5">

                        <div className="input-group mb-3" style={{ maxWidth: '20vw' }}>
                            <input onChange={(e) => setCode(e.target.value)} type="text" className="form-control" placeholder="Codigo" aria-label="Codigo" value={temp} id="Codigo" aria-describedby="button-addon2" />
                            <button onClick={() => getTeacher(code)} className="btn btn-primary" type="button" id="button-addon2">Buscar</button>
                        </div>
                        

                        <MiComponente></MiComponente>
                        <table className="table table-bordered">
                            <thead className="bg-primary text-white">
                                <tr>
                                    <th scope="col">id archivo</th>
                                    <th scope="col">id Maestro</th>
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
                                        <td>{user.idTeachers}</td>
                                        <td>{user.academyName}</td>
                                        <td>{user.courseName}</td>
                                        <td>{user.evidenceType}</td>
                                        <td>{user.shift}</td>
                                        <td>{user.fileName}</td>
                                        <td><button onClick={() => window.open(`${API}/fileView/${user.id}`, '_blank','width = 600px','height = 900px')} className="btn btn-warning btn-sm text-primary"><FontAwesomeIcon icon={faFileAlt} /></button></td>
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
