import React, { useState } from 'react'
import background from "../images/dawn.svg";
import { Link } from 'react-router-dom'
import { Redirect } from "react-router-dom"

const API = process.env.REACT_APP_API;

export const Login = () => {
  const [correo, setCorreo] = useState('')
  const [contraseña, setContraseña] = useState('')
  const em = sessionStorage.getItem("email")

  const handelSubmit = async (e) => {
    e.preventDefault()
    
    const opts = {
      method: 'POST',
      mode: 'cors',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        correo: correo,
        contraseña: contraseña
      })
    };

    const res = await fetch(`${API}/`, opts)
    const data = await res.json()
    if (res.status === 200) {
      sessionStorage.setItem("email", data.email);
      sessionStorage.setItem("id", data.id)
      sessionStorage.setItem("Rol", data.Rol)
      sessionStorage.setItem("name", data.name);
      window.location.href = "/index"
    }
    else if (res.status === 401) {
      window.swal(JSON.stringify(data));
      setInterval(function(){ window.location.href = "/"; }, 3000);
    }

    

  }

  return (

    <div>
      {em && em !== "" && em !== undefined ? <Redirect to="/index" /> : <div className="container" style={{ backgroundImage: `url(${background})`, backgroundSize: '100%', height: '85vh', backgroundRepeat: 'no-repeat' }}>
        <div className="container mt-5" style={{ width: '550px' }}>
          <form onSubmit={handelSubmit} className="card card-body border-dark m-3 p-5 rounded" >

            <div className="form-group">
              <label htmlFor="exampleInputEmail1" className="form-label mt-4">Correo Electronico</label>
              <input
                type="email"
                onChange={e => setCorreo(e.target.value)}
                value={correo}
                className="form-control"
                placeholder="Coreo Electronico" required />
            </div>

            <div className="form-group">
              <label htmlFor="exampleInputPassword1" className="form-label mt-4">Contraseña</label>
              <input type="password"
                onChange={e => setContraseña(e.target.value)}
                value={contraseña}
                className="form-control"
                placeholder="Contraseña" required />
              <br />
            </div>

            <div className="form-group d-grid gap-2 ">
              <button type="submit" className="btn btn-primary">
                Iniciar Sesion
              </button>
            </div>
            <div className="form-group pt-3 text-center">
            <Link  className="nav-link" to="/Recovery_pass">¿Olvidaste tu contraseña o eres nuevo?</Link>
            </div>

          </form>
        </div>

      </div>}

    </div>
  )
}