import err from '../images/404.svg';
import { Link } from 'react-router-dom'

export const Error404 = () => {
    return (
        <div style={{ backgroundImage: `url(${err})`, height: '89vh' }}>
            <div className="alert alert-dismissible alert-danger">
                <button type="button" className="btn-close" data-bs-dismiss="alert" />
                <strong>Pagina no encontrada!</strong> <Link className="alert-link" to="/index">Ir a la pagina de inicio</Link> o intenta otra vez.
            </div>
        </div>
    )
}

export default Error404
