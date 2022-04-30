import React from 'react'
import { Link } from 'react-router-dom'

const API = process.env.REACT_APP_API;
const rol = sessionStorage.getItem("Rol")

export const Ybarra = () => {

  const kill = (e) => {
    const opts = {
      method: 'GET',
      mode: 'cors',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      }
    };

    fetch(`${API}/logout`, opts)
      .then(response => {
        if (response.status === 200) {
          return response.json()
        }
      })
      .then(data => {
        console.log(data)
        sessionStorage.removeItem("email", data.email)
        sessionStorage.removeItem("id", data.id)
        sessionStorage.removeItem("Rol", data.Rol)
        window.location.href = "/"
      })
      .catch(err => console.log(err))
  }

  function click() {
    if (rol === "2") {
        window.alert('No tienes acceso aqui')
    }
}


  return (

    <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/index">Reportes CUT</Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarColor01" aria-controls="navbarColor01" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon" />
        </button>
        <div className="collapse navbar-collapse" id="navbarColor01">
          <ul className="navbar-nav me-auto">
            <li className="nav-item">
              <Link className="nav-link" to="/profile">Perfil</Link>
            </li>
            <li className="nav-item">
              <Link onClick={click} className="nav-link" to="/viewfiles">Revision de archivos</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/index">Tutorial</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/about">About</Link>
            </li>
          </ul>
          <div className="logout">
            <button type="button" onClick={kill} className="btn btn-outline-warning btn-sm">Cerrar Sesion</button>
          </div>
        </div>
      </div>
    </nav>

  )


};