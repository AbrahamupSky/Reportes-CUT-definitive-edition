import { Link } from 'react-router-dom'
import card1 from '../images/Card1.svg';
import card2 from '../images/Card2.svg';
import card3 from '../images/Card3.svg';

export const Index = () => {
    const em = sessionStorage.getItem("email")
    const rol = sessionStorage.getItem("Rol")

    function hiddendiv(){
        var master1 = document.getElementById("master");
        var master2 = document.getElementById("maestro");
        var master3 = document.getElementById("maestro2");
        var boss = document.getElementById("jefe");

        if (rol === "2"){
            boss.hidden = true;
            master1.classList.add("row-cols-md-2")
            master1.classList.remove("row-cols-md-3")
        } 
        else if (rol === "1"){
            master2.hidden = true;
            master3.hidden = true;

            master1.classList.add("row-cols-auto-3")
            master1.classList.remove("row-cols-sm-3")
            master1.classList.add("justify-content-center")
            boss.style.width = "660px"
        }
    }

    const div = document.querySelector("div");

    return (
        <div className="container mt-5">

            <div className="alert alert-dark" role="alert">
                Bienvenido {em} has iniciado sesion!
            </div>
            
            <div className="row row-cols-1 row-cols-md-3 g-4" id ="master" onLoad={hiddendiv}>
                <div className="col Card1" id="maestro">
                    <div className="card h-100">
                        <img src={card1} className="card-img-top" alt="..." />
                        <div className="card-body">
                            <h5 className="card-title">Subir Archivos</h5>
                            <p className="card-text">En este apartado los maestros podran acceder para subir las evidencias generadas en el transcurso del semestre. </p>
                        </div>
                        <div className="text-center">
                            <Link to="/upload"><button className="btn btn-outline-primary justify-content" type="button">Ir al sitio</button></Link>
                        </div>
                    </div>
                </div>
                <div className="col Card2" id ="maestro2">
                    <div className="card h-100">
                        <img src={card2} className="card-img-top" alt="..." />
                        <div className="card-body">
                            <h5 className="card-title">Generar Reporte</h5>
                            <p className="card-text">Aqui podras generar el reporte de tus evidencias y actividades que has subido durante el semestre.</p>
                        </div>
                        <div className="text-center">
                            <Link to="/report"><button className="btn btn-outline-primary justify-content" type="button">Ir al sitio</button></Link>
                        </div>
                    </div>
                </div>
                <div className="col Card3" id="jefe">
                    <div className="card h-100">
                        <img src={card3} className="card-img-top" alt="..." />
                        <div className="card-body">
                            <h5 className="card-title">Revision de reportes</h5>
                            <p className="card-text">Area designada para el Jefe de departamento para la revision de actividades y evidencias.</p>
                        </div>
                        <div className="text-center">
                            <Link to="/audit"><button className="btn btn-outline-primary justify-content" type="button">Ir al sitio</button></Link>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    )
}