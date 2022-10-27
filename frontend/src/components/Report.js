import { Redirect } from "react-router-dom"
import React, { useState, useEffect } from "react";
import TableScrollbar from 'react-table-scrollbar'
import Plot from "./Plot";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFileAlt } from '@fortawesome/free-solid-svg-icons'

const API = process.env.REACT_APP_API;


export const Report = () => {
  const rol = sessionStorage.getItem("Rol")
  const id = sessionStorage.getItem("id");
  const em = sessionStorage.getItem("email")
  const [files, setFiles] = useState([]);
  const [cycles, setCycles] = useState([]);
  const [cycleSelect, setCycleSelect] = useState('');
  const [filter, setFilter] = useState("")


  //Se obtienen todos los archivos de la base de datos del usuario
  const getFiles = async () => {

    const opts = {
      method: "POST",
      mode: "cors",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        codigo: id,
        cycleSelect: cycleSelect,



      }),
    };

    const res = await fetch(`${API}/getfiles`, opts);
    const data = await res.json();
    setFiles(data);
    console.log(cycleSelect);
  }

  //obtenemos todos los ciclos escolares
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
    console.log(data);
  }

   
  useEffect(() => {
    getFiles();
    getCycles();
  }, [])


//Metodo para borrar los archivos
  const DeleFile = async (id) => {
    const userReponse = window.confirm('Estas Seguro de Eliminar este archivo?')
    if(userReponse){
      const res = await fetch(`${API}/deleteFile/${id}`, {
        method: 'DELETE'
      });
      const data = await res.json();
      console.log(data);
      await getFiles();
    }
  };

  //Metodo para descargar el reporte de los archios subidos
  const Download = async () => {

    const opts = {
      method: "POST",
      mode: "cors",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        Codigo: id,
      }),
    };

    const res = await fetch(`${API}/download/report/pdf`, opts)
    const data = await res.blob()
    const url = window.URL.createObjectURL(new Blob([data]),);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute(
      'download',
      `FileName.pdf`
    );
    // Append to html link element page
    document.body.appendChild(link);
    // Start download
    link.click();
    // Clean up and remove the link
    link.parentNode.removeChild(link);

  }

  //
  const captureCycle = async (e) => {
    e.preventDefault();
    await getFiles();
  }
  //funciones del filtro de busqueda
  const searcher = (e) => {
    setFilter(e.target.value)
    console.log(e.target.value)
  }
  
  let results = []
  if(!filter){
    results = files
  } else{
    results = files.filter((dato) => dato.fileName.toLowerCase().includes(filter.toLocaleLowerCase()))
    
  }

  return (
    <div>
      {rol === "1" ? <Redirect to="/index" /> :


        <div className="row" style={{ maxWidth: '99vw' }}>
          <div onClick={captureCycle} className="col-md-6 mt-3">
            <div className="text-center row border bg-primary">
              <h3 className="text-white p-2 m-1">ciclo</h3>
            </div>
            <select onChange={e => setCycleSelect(e.target.value)} className="form-select" name="cycle" id="cycle" required>
              <option value={""}>Todos</option>
              {
                cycles.map(cycle => (
                  <option key={cycle.id} value={cycle.id}> {cycle.cycle}</option>
                ))}
            </select>
          </div>
          
          <div className="col-md-6 mt-3">
            <div className="text-center row border bg-primary">
              <h3 className="text-white p-2 m-1">Filtro de Busqueda</h3>
            </div>
            
            <input className="form-control"  type="text" placeholder="Escribe una palabra clave" id="inputFilter" value={filter} onChange={searcher}/>

            

          </div>

          <div className="TABLA  col-md-8 mt-3">
            <TableScrollbar height = "80vh">
            <table className="table table-bordered">
              <thead className="bg-primary text-white">
                <tr>
                  <th scope="col">Turno</th>
                  <th scope="col">Categoria</th>
                  <th scope="col">Materia</th>
                  <th scope="col">Archivo</th>
                  <th scope="col">Eliminar</th>
                  <th scope="col">Ver</th>
                </tr>
              </thead>
              <tbody>
                {results.map(item => (
                  <tr key={item.id}>
                    <td>{item.shift}</td>
                    <td>{item.evidenceType}</td>
                    <td>{item.courseName}</td>
                    <td style={{ maxWidth: '280px' }}>{item.fileName}</td>
                    <td className="text-center">
                      <button onClick={() => DeleFile(item.id)} className="btn btn-danger btn-sm">Eliminar</button>
                    </td>
                    
                    <td><button onClick={() => window.open(`${API}/fileView/${item.id}`, '_blank')} className="btn btn-warning btn-sm text-primary"><FontAwesomeIcon icon={faFileAlt} /></button></td>
                  </tr>
                ))}
              </tbody>
            </table>
            </TableScrollbar>
          </div>

          <div className="PLOT  col-md-4 mt-3 border border-dark" style={{ maxHeight: '91vh' }} >

            <div className="Codigo mt-3">
              <label className="form-label mt-2" htmlFor="readOnlyInput">Correo Institucional:</label>
              <input className="form-control" value={em} id="readOnlyInput" type="text" placeholder="Ninguno" readOnly />
            </div>
            <div className="Codigo mt-1 mb-4">
              <label className="form-label mt-2" htmlFor="readOnlyInput">Codigo:</label>
              <input className="form-control" value={id} id="readOnlyInput" type="text" placeholder="Ninguno" readOnly />
            </div>
            <div className="border border-dark mb-4">
              <Plot />
            </div>
            <div className="text-center d-grid gap-2">
              <button onClick={() => Download()} type="button" className="btn btn-lg btn-success text-primary">Generar Reporte</button>
            </div>

          </div>

        </div>

      }
    </div>
  );
};
export default Report;