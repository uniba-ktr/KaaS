const axios = require('axios');

export const KatharaFunction = {
  LCREATE: "lcreate",
  LSTART: "lstart",
  LINFO: "linfo",
  LCLEAN: "lclean",
  WIPE: "wipe"
}

export const RESTCalls = {
  GET: "get",
  POST: "post",
  DELETE: "delete"
}

// TODO: adjust to docker network!
const kathara_url = "http://localhost:8000/"

export async function call_kathara(kathara_function, data, req=RESTCalls.POST) {
  let response
  switch(req) {
    case RESTCalls.POST:
      response = await axios.post(kathara_url + kathara_function, data);
      break;
    case RESTCalls.GET:
      response = await axios.get(kathara_url + kathara_function, data);
      break;
    case RESTCalls.DELETE:
      response = await axios.delete(kathara_url + kathara_function, data);
      break;
    default:
      Vue.$log.error("Can not call REST API with ", req)
  }
  return response.data;
}

