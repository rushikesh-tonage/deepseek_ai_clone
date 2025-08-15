import jwt from "jsonwebtoken";
import config from "../config.js";

function userMiddleware(req,res,next){
    const authHeader=req.headers.authorization;
    if(!authHeader||!authHeader.startsWith("Bearer")){
        return res.status(401).send({errors:"no token provided"});
    }
    
    try {
        const token=authHeader.split(" ")[1];
        const decoded= jwt.verify(token ,config.JWT_USER_PASSWORD);
        console.log(decoded);   
        req.userId=decoded.id;

        next();

    } catch (error) {
        console.log(error);
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        setAuthUser(null);
        navigate("/login");
        alert("Logout Successfully");
        window.location.reload();
        return res.status(400).send({errors:"invalid token or expired"});
    }
}

export default userMiddleware;