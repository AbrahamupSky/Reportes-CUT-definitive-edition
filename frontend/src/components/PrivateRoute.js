import { Redirect, Route } from "react-router-dom"

export const PrivateRoute = ({ component: Component, ...rest }) => {

    const em = sessionStorage.getItem("email")

    return (<Route {...rest}>{em && em !== "" && em !== undefined? <Component /> : <Redirect to="/" />}</Route>);

};



export default PrivateRoute
