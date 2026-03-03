import * as actions from "./actions";

export const buildSoapPayload = (action, data) => {

    const payloadBuilder = actions[action];
    if (!payloadBuilder) {
        throw new Error(`Unknown SOAP action: ${action}`);
    }
    return payloadBuilder(data);
};
