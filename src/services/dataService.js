import { getCustomerData, getTicketData } from '../queries/dataQueries';
import { NotFoundError } from '../utils/CustomError';
import { MESSAGES } from "../config/messages";

export const getData = async ({ Type, StartDate, EndDate, UserId, Role }) => {
 let response = '';
 
  if (Type === 'Customer') {
    response = await getCustomerData(StartDate, EndDate, UserId, Role);
  }
  else if (Type === 'Ticket') {
    response = await getTicketData(StartDate, EndDate, UserId, Role);
  } else {
    throw new NotFoundError(MESSAGES.INCORRECT_TYPE);
  }

  return { response };
};
