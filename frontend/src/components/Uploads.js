import React, { useEffect, useState } from 'react';
import { Redirect } from "react-router-dom"

const API = process.env.REACT_APP_API;

export const Uploads = () => {

    const [academy, setAcademy] = useState([])
    const [course, setCourse] = useState([])
    const [select, setSelect] = useState('')
    const [cycles, setCycles] = useState([]);
    
    //Variable de session
    const id = sessionStorage.getItem("id")
    const rol = sessionStorage.getItem("Rol")

    const getCycles = async () => {
        const opts = {
          method: "POST",
          mode: "cors",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        };
        const res = await fetch(`${API}/getSchoolCycles`, opts);
        const data = await res.json();
        setCycles(data);
    }

    const getAcademy = async () => {
        const opts = {
            method: 'GET',
            mode: 'cors',
            credentials: 'include',
        };

        const res = await fetch(`${API}/academy`, opts)
        const data = await res.json()
        if (res.status === 200) {
            setAcademy(data)
        }
        else if (res.status === 401) {
            window.alert(JSON.stringify(data));
        }
    }

    const getCourse = async (e) => {
        e.preventDefault()
        const opts = {
            method: 'POST',
            mode: 'cors',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                academia: select,
            })
        };

        const res = await fetch(`${API}/course`, opts)
        const data = await res.json()
        if (res.status === 200) {
            setCourse(data)
        }
        else if (res.status === 401) {
            window.alert(JSON.stringify(data));
        }
    }

    useEffect(() => {
        getCycles();
        getAcademy();
    }, []);


    return (
        <div>
            {rol === "1" ? <Redirect to="/index" /> :
                <div className="container">

                    <div className="text-center row border bg-primary mt-5">
                        <h3 className="text-white p-2 m-1">Sube tus archivos aqui</h3>
                    </div>

                    <form target="_blank" action={`${API}/uploads`} method="POST" encType="multipart/form-data" className="row border border border-dark mt-3 p-4 rounded">

                        <div className="form-group col-md-4">
                            <fieldset>
                                <label className="form-label mt-4" htmlFor="idTeachers">Codigo UDG</label>
                                <input name="idTeachers" id="idTeachers" className="form-control" value={id} type="text" placeholder="Readonly input here..." readOnly />
                            </fieldset>
                        </div>

                        <div onClick={getCourse} className="col-md-4" >
                            <label htmlFor="exampleSelect1" className="form-label mt-4">Academia</label>
                            <select onChange={e => setSelect(e.target.selectedIndex)} className="form-select" name="academyName" id="academyName" required>
                                <option defaultValue="0"></option>
                                {academy.map(elemento => (
                                    <option key={elemento.idAcademy} value={elemento.id}> {elemento.nameAcademy}</option>
                                ))}
                            </select>
                        </div>

                        <div className="col-md-4">
                            <label htmlFor="exampleSelect1" className="form-label mt-4">Materia</label>
                            <select className="form-select" id="courseName" name="courseName" required>
                                <option defaultValue="0"></option>
                                {course.map(elemento => (
                                    <option key={elemento.NameCourse} value={elemento.NameCourse}>{elemento.NameCourse}</option>
                                ))}
                            </select>
                        </div>

                        <div className="form-group col-md-3">
                            <fieldset>
                                <label className="form-label mt-4" htmlFor="readOnlyInput">Tipo de evidencia</label>
                                <select className="form-select" id="evidenceType" name="evidenceType" required>
                                    <option defaultValue="0"></option>
                                    <option value="Actividades">Actividades</option>
                                    <option value="Examen">Examen</option>
                                    <option value="Lista de Asistencia">Lista de Asistencia</option>
                                    <option value="Proyecto">Proyecto</option>              
                                </select>
                            </fieldset>
                        </div>

                        <div className="form-group col-md-2">
                            <fieldset>
                                <label className="form-label mt-4" htmlFor="readOnlyInput">Turno de la materia</label>
                                <select className="form-select" id="shift" name="shift" required>
                                    <option ></option>
                                    <option value="Matutino">Matutino</option>
                                    <option value="Vespertino">Vespertino</option>
                                </select>
                            </fieldset>
                        </div>

                        <div className="form-group col-md-2">
                            <fieldset>
                                <label className="form-label mt-4" htmlFor="readOnlyInput">Ciclo</label>
                                <select className="form-select" id="cycle" name="cycle" required>
                                    <option defaultValue="0"></option>
                                    {cycles.map(cycle => (
                                        <option key={cycle.id} value={cycle.id}> {cycle.cycle}</option>
                                    ))}
                                </select>
                            </fieldset>
                        </div>

                        <div className="col-md-5">

                            <label htmlFor="formFile" className="form-label mt-4">Selecciona tu archivo</label>
                            <input className="form-control" type="file" name="formFile" id="formFile" multiple required />

                        </div>

                        <div className="text-center mt-5" >
                            <button style={{ width: '50%' }} type="submit" className="btn btn-primary ">Subir Archivos</button>
                            <button className="btn btn-warning text-dark" type="reset">Limpiar</button>
                        </div>


                    </form>

                </div>
            }
        </div>
    )
}

export default Uploads
