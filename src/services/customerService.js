import { generateNumericId } from '../utils/HelperClass';
import {
    insertCustomer, insertServiceAddress, insertBillingInfo,
    insertServiceLines, insertRoutes
} from '../queries/customerQueries';
import { callSoapApi } from '../models/soap/soapService';
import { ValidationError } from "../utils/CustomError";

export const createCustomer = async ({ customerConfig, customerBio, serviceAddress, billingInfo,
    serviceLines, routes, createdby }) => {

    const transactionId = generateNumericId(10);
    const customerId = generateNumericId(10);
    
    // Step 1: Call SOAP API
    const soapPayload = {
        sourceSystemID: {
            customerConfig, customerBio, serviceAddress, billingInfo,
            serviceLines, routes, customerId
        },
        esbTransactionID: transactionId,
    };

    // Step 2: Call SOAP API
    const soapResponse = await callSoapApi("customerCreateRequest", soapPayload);

    // Step 3: Check if SOAP response is successful
    if (!soapResponse.success) {
        throw new ValidationError(`SOAP request failed: ${soapResponse.error}`);
    }

    // Step 4: If SOAP response is successful, insert data into database
    await insertCustomerDataInOrder(transactionId, customerId, {
        customerConfig,
        customerBio,
        serviceAddress,
        billingInfo,
        serviceLines,
        routes,
    }, createdby);

    return { transactionId, soapResponse };
};

// Helper function to handle database inserts in the correct order
const insertCustomerDataInOrder = async (transactionId, customerId, { customerConfig, customerBio,
    serviceAddress, billingInfo, serviceLines, routes }, createdby) => {

    await insertCustomer(transactionId, customerId, customerConfig, customerBio, createdby);
    await insertServiceAddress(transactionId, serviceAddress);
    await insertBillingInfo(transactionId, billingInfo);
    if (serviceLines) {
        await insertServiceLines(transactionId, serviceLines);
    }
    if (routes) {
        await insertRoutes(transactionId, routes);
    }
};

export const bulkInsertCustomers = async ({ records, meta }) => {
    const transactionId = generateNumericId(10); // Generate unique transaction ID

    // await insertCustomerDataInOrder(transactionId, {
    //     customerConfig,
    //     customerBio,
    //     serviceAddress,
    //     billingInfo,
    //     serviceLines,
    //     routes,
    // });

    return { transactionId };
};