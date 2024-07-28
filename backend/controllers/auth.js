import { setResponse, setErrorResponse } from "./response-handler.js";

export const userLogin = async (request,response) =>{
    try{
        setResponse("Call smart contracts to update blockchain from here...", response);
    } catch(error){
        console.log(error);
        setErrorResponse(error, response);
    }
  
}