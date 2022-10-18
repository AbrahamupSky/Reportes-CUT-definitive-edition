import { Redirect } from "react-router-dom";
import React, { useState, useEffect } from "react";
import TableScrollbar from "react-table-scrollbar";
import Plot from "./Plot";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileAlt } from "@fortawesome/free-solid-svg-icons";
import _ from "lodash"


const API = process.env.REACT_APP_API;

export const Cycles = () => {
    const rol = sessionStorage.getItem("Rol");
    const id = sessionStorage.getItem("id");
    const em = sessionStorage.getItem("email");
    const [cycles, setCycles] = useState([]);
    const [currentPage, setCurrentPage] = useState(1) //Mapeo de la navegacion
    const pageSize = 4; //Tamaño de la tabla por pagina
    const [paginated, setPaginated] = useState([]) //Mapeo de ciclos con slice()
    const [year, setYear] = useState('')
    const [period, setPeriod] = useState('')

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
        setPaginated(_(data.reverse()).slice(0).take(pageSize).value());
        setCycles(data);
    };

    useEffect(() => {
        getCycles();
    }, []);

    const pagination = (pageNo) => {
        setCurrentPage(pageNo)
        const startIndex = (pageNo - 1) * pageSize
        const paginatedPost = _(cycles).slice(startIndex).take(pageSize).value()
        setPaginated(paginatedPost)
    }

    const pageCount = cycles ? Math.ceil(cycles.length / pageSize) : 0;
    const pages = _.range(1, pageCount + 1);


    const AddCycle = async (e) => {
        e.preventDefault();
        let formulario = document.getElementById('formCycle');
        formulario.reset();
        console.log(year);
        console.log(period);

        var cycleToAdd = year + "-" + period;
        console.log(cycleToAdd);

        const res = await fetch(`${API}/addCycle`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                cycle: cycleToAdd,
            })
        })

        const data = await res.text()
        if (res.status === 200){
            window.alert(data);
        }else{
            window.alert(data);
        }
        await getCycles();
    }

    return (
        <div>
            {rol === "1" ? <Redirect to="/index" /> :

                <div className="row" style={{ maxWidth: '99vw' }}>

                    <div className="col-md-8 m-5">

                        <div className="text-center row border bg-primary mt-5">
                            <h3 className="text-white p-2 m-1">Control de ciclos</h3>
                        </div>

                        <table className="table table-bordered" >
                            <thead className="bg-primary text-white">
                                <tr>
                                    <th scope="col">Id</th>
                                    <th scope="col">Ciclo</th>
                                </tr>
                            </thead>
                            <tbody>
                                {paginated.map(cycle => (
                                    <tr key={cycle.id}>
                                        <td>{cycle.id}</td>
                                        <td>{cycle.cycle}</td>
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

                    <div className="border border-dark col-md-3 mt-5 mb-5">
                        <div className="mt-3 alert alert-info d-flex align-items-center" role="alert">
                            <div>
                                Agregar ciclos
                            </div>
                        </div>


                        <form onSubmit={AddCycle} method="POST" id="formCycle">
                            <div className="form-group">
                                <label htmlFor="year" className="form-label mt-2">Año:</label>
                                <input onChange={e => setYear(e.target.value)} className="form-control" id="year" name="year" type="text" maxlength="4" size="4" placeholder="Ingrese año escolar" pattern="[0-9]{4}" required/>
                            </div>
                            <div className="form-group">
                                <label htmlFor="period" className="form-label mt-4">Periodo</label>
                                <select onChange={e => setPeriod(e.target.value)} className="form-control" name="period" id="period" required>
                                    <option value="">Seleccione un periodo</option>
                                    <option value="A">A</option>
                                    <option value="B">B</option>
                                </select>
                            </div>
                            <div className="text-center mt-4">
                                <button style={{ width: '60%' }} type="submit" className="btn btn-primary">Agregar</button>
                            </div>
                        </form>
                    </div>

                </div>
            }
        </div>



    );
};
export default Cycles;
