import React from 'react'
import cut from '../images/cut.png'

export const About = (props) => {

    console.log()

    return (
        <center>
            <div style={{ width: '450px' }} className='logo cut container mt-5'>
                <form method="">
                    <div className='row card border-dark mb-3 rounded p-4'>
                        <div className='card-img-top'>
                            <img src={cut} alt="logo" />
                        </div>

                        <div className='card-body'>
                            <div className='card-title text-center'>
                                <h5>About Reportes CUT</h5>
                                <p className='form-label mt-4 text-center'>Pagina dedicada a los jefes de departamento, maestros y presidentes de academias. En las cuales podrán subir sus archivos y reportes, como actividades, examenes, listas de asistencia y proyectos, así como también pueden generar reportes en los cuales pueder ver los turnos, categorias, materias, archivos adjuntos, archivarlos y verlos.</p>
                            </div>
                        </div>
                    </div>
                    
                </form>
            </div>
        </center>
    )
}

export default About


