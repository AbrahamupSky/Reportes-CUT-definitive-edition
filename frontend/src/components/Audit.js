import { Redirect } from "react-router-dom"
import React, { useEffect, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEye, faDownload } from '@fortawesome/free-solid-svg-icons'
import _ from "lodash"
import { Link } from 'react-router-dom'
 
const API = process.env.REACT_APP_API;

export const Audit = () => {
    const rol = sessionStorage.getItem("Rol")
    const [users, setUsers] = useState([]) //Trae usuarios para la paginacion
    const [name, setName] = useState('')//Setea el nombre para la vista rapida
    const [code, setCode] = useState('')//Sete el codigo para descargar reporte en la vista rapida
    const [quick, setQuick] = useState([]) //Mapeo de la informacion de vista rapida
    const [paginated, setPaginated] = useState([]) //Mapeo de usuarios con slice()
    const [currentPage, setCurrentPage] = useState(1) //Mapeo de la navegacion
    const pageSize = 4; //Tamaño de la tabla por pagina

    const getUsers = async () => {

        const opts = {
            method: 'GET',
            mode: 'cors',
            credentials: 'include',
        };

        const res = await fetch(`${API}/users`, opts)
        const data = await res.json();
        setPaginated(_(data).slice(0).take(pageSize).value());
        setUsers(data)
    }

    useEffect(() => {
        getUsers();
    }, [])

    const select = async (nombre, codigo) => {
        setName(nombre)
        setCode(codigo)
        var aux = document.getElementById("ocultar");
        aux.style.visibility = "visible";

        const res = await fetch(`${API}/quickview/${codigo}`)
        const data = await res.json()
        setQuick(data)
    }

    const makeReport = async (codigo) => {

        const opts = {
            method: 'POST',
            mode: 'cors',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                Codigo: codigo,
            })
        };

        const res = await fetch(`${API}/download/report/pdf`, opts)
        const data = await res.blob()
        const url = window.URL.createObjectURL(new Blob([data]),);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute(
            'download',
            `Reporte-Evidencias-` + codigo + `.pdf`,
        );
        // Append to html link element page
        document.body.appendChild(link);
        // Start download
        link.click();
        // Clean up and remove the link
        link.parentNode.removeChild(link);
    }

    const pagination = (pageNo) => {
        setCurrentPage(pageNo)
        const startIndex = (pageNo - 1) * pageSize
        const paginatedPost = _(users).slice(startIndex).take(pageSize).value()
        setPaginated(paginatedPost)
    }


    const filter = (term) => {
        var searchResult = users.filter((elemento) => {
            if (elemento.codeUDG.toString().toLowerCase().includes(term.toLowerCase())
                || elemento.fullName.toString().toLowerCase().includes(term.toLowerCase())
            ) {
                return paginated
            }
            return searchResult
        })
        setPaginated(searchResult)
        if (term === '') {
            getUsers()
        }
    }

    const pageCount = users ? Math.ceil(users.length / pageSize) : 0;
    const pages = _.range(1, pageCount + 1);

    function temp() {
        sessionStorage.setItem('Temp',code)
    }

    return (
        <div>
            {rol === "2" ? <Redirect to="/index" /> :


                <div className="row" style={{ maxWidth: '99vw' }}>
                    
                    <div className="col-md-8 m-5">
                        
                        <div className="form-floating mb-3 col-md-5">
                            <input
                                type="text"
                                className="form-control"
                                id="floatingInput"
                                placeholder="******"
                                onChange={e => filter(e.target.value)}
                            />
                            <label htmlFor="floatingInput">Buscar por Codigo o Nombre</label>
                        </div>

                        <table className="table table-bordered">
                            <thead className="bg-primary text-white">
                                <tr>
                                    <th scope="col">Codigo</th>
                                    <th scope="col">Nombre</th>
                                    <th scope="col">Correo</th>
                                    <th scope="col">Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {paginated.map(user => (
                                    <tr key={user.codeUDG}>
                                        <td>{user.codeUDG}</td>
                                        <td>{user.fullName}</td>
                                        <td>{user.email}</td>
                                        <td className="text-center">
                                            <button onClick={() => select(user.fullName, user.codeUDG)} className="btn btn-primary btn-sm"><FontAwesomeIcon icon={faEye} /></button>
                                            <button onClick={() => makeReport(user.codeUDG)} className="btn btn-success btn-sm"><FontAwesomeIcon icon={faDownload} /></button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        <nav aria-label="...">
                            <ul className="pagination">
                                {
                                    pages.map((page) => (

                                        <li key={page} className={page === currentPage ? "page-item active" : "page-item"}>
                                            <button className="page-link" onClick={() => pagination(page)}> {page} </button>
                                        </li>
                                    ))
                                }
                            </ul>
                        </nav>

                    </div>

                    <div className="border border-dark col-md-3 mt-5 mb-5" style={{ visibility: 'hidden' }} id="ocultar">

                        <svg xmlns="http://www.w3.org/2000/svg" style={{ display: 'none' }}>
                            <symbol id="check-circle-fill" fill="currentColor" viewBox="0 0 16 16">
                                <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z" />
                            </symbol>
                            <symbol id="info-fill" fill="currentColor" viewBox="0 0 16 16">
                                <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16zm.93-9.412-1 4.705c-.07.34.029.533.304.533.194 0 .487-.07.686-.246l-.088.416c-.287.346-.92.598-1.465.598-.703 0-1.002-.422-.808-1.319l.738-3.468c.064-.293.006-.399-.287-.47l-.451-.081.082-.381 2.29-.287zM8 5.5a1 1 0 1 1 0-2 1 1 0 0 1 0 2z" />
                            </symbol>
                            <symbol id="exclamation-triangle-fill" fill="currentColor" viewBox="0 0 16 16">
                                <path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z" />
                            </symbol>
                        </svg>
                        <div className="mt-3 alert alert-info d-flex align-items-center" role="alert">
                            <svg className="bi flex-shrink-0 me-2" width={24} height={24} role="img" aria-label="Info:"><use xlinkHref="#info-fill" /></svg>
                            <div>
                                Informacion breve del profesor
                            </div>
                        </div>

                        <div className="Nombre mt-4">
                            <label className="form-label" htmlFor="readOnlyInput">Profesor seleccionado:</label>
                            <input className="form-control" value={name} id="readOnlyInput" type="text" placeholder="Ninguno" readOnly />
                        </div>
                        <div className="Codigo">
                            <label className="form-label mt-2" htmlFor="readOnlyInput">Codigo:</label>
                            <input className="form-control" value={code} id="readOnlyInput" type="text" placeholder="Ninguno" readOnly />
                        </div>

                        <div className="card mt-4">
                            <div className="card-body">
                                <p id="p1" className="card-text">Materias asignadas al profesor:
                                    <br />
                                    {quick[0] === undefined ? '-' : quick[0].map(elemento => (<span className="badge rounded-pill bg-warning text-primary" key={elemento.courseName}>{elemento.courseName}</span>))}
                                </p>

                                <p className="card-text">Ultima evidencia registrada :
                                    <br />
                                    {quick[1] === undefined ? '-' : quick[1].map(elemento => (<span className="badge rounded-pill bg-warning text-primary" key={elemento.lastdate}>{elemento.lastdate}</span>))}
                                </p>

                                <p className="card-text">Evidencias totales :
                                    <br />
                                    {quick[2] === undefined ? '-' : quick[2].map(elemento => (<span className="badge rounded-pill bg-warning text-primary" key={elemento.total}>{elemento.total}</span>))}
                                </p>

                                <hr />
                                <p className="card-text text-center"> <Link to="/viewfiles"><button onClick={temp} className="btn btn-warning text-black" type="button">Ver Archivos</button></Link> </p>
                            </div>
                        </div>
                        
                    </div>

                </div>

            }
        </div>
        
    )
}
export  default  Audit 
