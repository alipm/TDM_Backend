const SOAP_API_CONFIG = {
    customerCreateRequest: {
        url: "https://maswebsvcscdcqa.wm.com/MASCreateUpdateCustomerOTC/services/MASCreateUpdateCustomerSEIPort",
        url2: "https://maswebsvcscdcqa2.wm.com/MASCreateUpdateCustomerOTC/services/MASCreateUpdateCustomerSEIPort",
    },
    ticketCreateRequest: {
        url: "http://maswebsvcscdcqa.wm.com/MASCaseTicketInterface/services/MASCreateUpdateCases",
        url2: "http://maswebsvcscdcqa2.wm.com/MASCaseTicketInterface/services/MASCreateUpdateCases",
    }
};

const SOAP_CREDENTIALS = {
    username: "MASWEBSVC",
    password: "Hbf5kGnh9@dRoj7",
};

export { SOAP_API_CONFIG, SOAP_CREDENTIALS };
