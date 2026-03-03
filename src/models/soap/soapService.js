import { sendSoapRequest } from "./soapRequestModel";

export const callSoapApi = async (action, data) => {
    const response = await sendSoapRequest(action, data);

    if (action == 'customerCreateRequest' && response.status !== "true") {
        return { success: false, error: response.error };
    } else if (action == 'ticketCreateRequest' && response.status !== "SUCCESS") {
        return { success: false, error: response.error };
    }

    return { success: true, data: response.data };
};
