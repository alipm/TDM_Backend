import { insertTicket, insertbulkTicket } from '../queries/ticketQueries';
import DateUtils from "../utils/DateUtils";
import { generateNumericId } from '../utils/HelperClass';
import { callSoapApi } from '../models/soap/soapService';
import { ValidationError } from "../utils/CustomError";

export const createTicket = async ({ Customer_ID, Environment, Category, Sub_Category,
  Waste_Type, Dispatch_Date, Swappable_Flag, Transaction_ID, createdby }) => {

  const formattedDispatchDate = DateUtils.formatDate(Dispatch_Date);
  // Step 1: Call SOAP API
  const soapPayload = {
    sourceSystemID: {
      Customer_ID, Environment, Category, Sub_Category,
      Waste_Type, formattedDispatchDate, Swappable_Flag
    },
    esbTransactionID: Transaction_ID,
  };

  // Step 2: Call SOAP API
  const soapResponse = await callSoapApi("ticketCreateRequest", soapPayload);

  // Step 3: Check if SOAP response is successful
  if (!soapResponse.success) {
    throw new ValidationError(`SOAP request failed: ${soapResponse.error}`);
  }

  // Step 4: Insert data into respective tables
  const ticket = await insertTicket(Customer_ID, Environment, Category, Sub_Category,
    Waste_Type, formattedDispatchDate, Swappable_Flag ? 'True' : 'False', Transaction_ID, createdby);
  return { ticket };
};

export const bulkInsertTicket = async ({ records, createdby }) => {
  const insertedIds = [];
  const errors = [];

  for (const record of records) {
    try {
      // Format date
      const formattedDispatchDate = DateUtils.formatDate(record.Dispatch_Date);

      // Prepare SOAP payload
      const soapPayload = {
        sourceSystemID: {
          Customer_ID: record.Customer_ID,
          Environment: record.Environment,
          Category: record.Category,
          Sub_Category: record.Sub_Category,
          Waste_Type: record.Waste_Type,
          formattedDispatchDate,
          Swappable_Flag: record.Swappable_Flag,
        },
        esbTransactionID: generateNumericId(10),
      };

      // Call SOAP API
      const soapResponse = await callSoapApi('ticketCreateRequest', soapPayload);

      if (!soapResponse.success) {
        // Log SOAP errors
        errors.push({ record, error: soapResponse.error });
        continue; // Skip to the next record
      }

      // Insert into the database
      const insertedId = await insertTicket(
        record.Customer_ID,
        record.Environment,
        record.Category,
        record.Sub_Category,
        record.Waste_Type,
        formattedDispatchDate,
        record.Swappable_Flag ? 'True' : 'False',
        soapPayload.esbTransactionID,
        createdby
      );

      insertedIds.push(insertedId);

    } catch (error) {
      // Capture and log any other errors
      errors.push({ record, error: error.message });
    }
  }

  return { insertedIds, errors };
};
