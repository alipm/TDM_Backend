import axios from "axios";
import { SOAP_API_CONFIG } from "../../config/soapConfig";
import { buildSoapPayload } from "./soapPayloadBuilder";
import { parseSoapResponse } from "./soapResponseParser";
import { SOAP_CREDENTIALS } from "../../config/soapConfig";
import { ValidationError } from "../../utils/CustomError";
import { MESSAGES } from "../../config/messages";

export const sendSoapRequest = async (action, data) => {
    const soapApiConfig = SOAP_API_CONFIG[action];
    const { username, password } = SOAP_CREDENTIALS;

    if (!soapApiConfig) {
        throw new ValidationError(`SOAP API URL not found for action: ${action}`);
    }

    // Determine the correct URL based on the action and data
    let url;
    if (action === "ticketCreateRequest" && data.sourceSystemID.Environment === "WMCDCQA") {
        url = soapApiConfig.url;
    } else if (action === "ticketCreateRequest" && data.sourceSystemID.Environment === "WMDIGTQE") {
        url = soapApiConfig.url2;
    } else if (action === "customerCreateRequest" && data.sourceSystemID.customerConfig.environment === "WMCDCQA") {
        url = soapApiConfig.url;
    } else if (action === "customerCreateRequest" && data.sourceSystemID.customerConfig.environment === "WMDIGTQE") {
        url = soapApiConfig.url2;
    } else {
        throw new ValidationError(MESSAGES.INCORRECT_ENVIRONMENT);
    }

    try {
        const soapPayload = buildSoapPayload(action, data).replace(/[\n\t]/g, '').trim();
        // console.log(`Payload size: ${soapPayload.length} characters`);
        console.log(`Payload: ${soapPayload} characters`);
        const response = await axios.post(url, soapPayload, {
            headers: {
                "SOAPAction": url,
            },
            auth: {
                username,
                password,
            }
        });

        return await parseSoapResponse(action, response.data); // Parse SOAP response
    } catch (error) {
        throw new ValidationError(`SOAP request failed: ${error.response.data !== null ? error.response.data : error}`);
    }
};
