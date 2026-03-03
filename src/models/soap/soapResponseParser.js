// src/models/soap/soapResponseParser.js
import { parseStringPromise } from "xml2js"; // Use xml2js to parse XML

export const parseSoapResponse = async (action, xml) => {
    try {
        const result = await parseStringPromise(xml, { explicitArray: false });
        const body = result["soapenv:Envelope"]["soapenv:Body"];
        
        if(action == 'customerCreateRequest'){
            const response = body["MASCustomerChangeResponse"] || {};
            return {
                status: response.OK._ || "FAILURE",
                data: xml,
                error: JSON.stringify(response.Errors) || null,
            };
        } else if(action == 'ticketCreateRequest'){
            const response = body["MASCreateUpdateCasesResponse"] || {};
            return {
                status: response.statusCd._ || "FAILURE",
                data: xml,
                error: JSON.stringify(response.statusDesc) || null,
            };
        }
        
        
    } catch (error) {
        throw new Error("Failed to parse SOAP response");
    }
};
