import { Link } from 'react-router-dom'
import card1 from '../images/Card1.svg';
import card2 from '../images/Card2.svg';
import card3 from '../images/Card3.svg';

export const Index = () => {
    const em = sessionStorage.getItem("email")
    const rol = sessionStorage.getItem("Rol")

    function buttonUpload() {
        if (rol === "1") {
            window.alert('No tienes acceso aqui')
        }
    }

    function buttonReport() {
        if (rol === "1") {
            window.alert('No tienes acceso aqui')
        }
    }

    function buttonAudit() {
        if (rol === "2") {
            window.alert('No tienes acceso aqui')
        }
    }



    return (
        <div className="container mt-5">

            <div className="alert alert-dark" role="alert">
                Bienvenido {em} has iniciado sesion!.
            </div>

            <div className="row row-cols-1 row-cols-md-3 g-4">
                <div className="col Card1">
                    <div className="card h-100">
                        <img src={card1} className="card-img-top" alt="..." />
                        <div className="card-body">
                            <h5 className="card-title">Subir Archivos</h5>
                            <p className="card-text">En este apartado los maestros podran acceder para subir las evidencias generadas en el transcurso del semestre. </p>
                        </div>
                        <div className="text-center">
                            <Link to="/upload"><button onClick={buttonUpload} className="btn btn-outline-primary justify-content" type="button">Ir al sitio</button></Link>
                        </div>
                        <div className="card-footer mt-3">
                            <small className="text-muted">(Solo Maestros)</small>
                        </div>
                    </div>
                </div>
                <div className="col Card2">
                    <div className="card h-100">
                        <img src={card2} className="card-img-top" alt="..." />
                        <div className="card-body">
                            <h5 className="card-title">Generar Reporte</h5>
                            <p className="card-text">Aqui podras generar el reporte de tus evidencias y actividades que has subido durante el semestre.</p>
                        </div>
                        <div className="text-center">
                            <Link to="/report"><button onClick={buttonReport} className="btn btn-outline-primary justify-content" type="button">Ir al sitio</button></Link>
                        </div>
                        <div className="card-footer mt-3">
                            <small className="text-muted">(Solo Maestros)</small>
                        </div>
                    </div>
                </div>
                <div className="col Card3">
                    <div className="card h-100">
                        <img src={card3} className="card-img-top" alt="..." />
                        <div className="card-body">
                            <h5 className="card-title">Revision de reportes</h5>
                            <p className="card-text">Area designada para el Jefe de departamento para la revision de actividades y evidencias.</p>
                        </div>
                        <div className="text-center">
                            <Link to="/audit"><button onClick={buttonAudit} className="btn btn-outline-primary justify-content" type="button">Ir al sitio</button></Link>
                        </div>
                        <div className="card-footer mt-3">
                            <small className="text-muted">(Jefe de Departamento)</small>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    )
}