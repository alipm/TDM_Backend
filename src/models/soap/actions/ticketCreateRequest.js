export const ticketCreateRequest = (data) => {

    return `
        <SOAP-ENV:Envelope xmlns:SOAP-ENV="http://schemas.xmlsoap.org/soap/envelope/" xmlns:SOAP-ENC="http://schemas.xmlsoap.org/soap/encoding/" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"> 
	<SOAP-ENV:Header/> 
	<SOAP-ENV:Body> 
		<tns:MASCreateUpdateCasesRequest xmlns:tns="http://cases.integration.mas.wm.com/"> 
			<MASCase> 
				<SourceSystemID>MAS</SourceSystemID> 
				<ESBTransactionID>${data.esbTransactionID}</ESBTransactionID>  
				<MASCustomerID>${data.sourceSystemID.Customer_ID}</MASCustomerID> 
				<NewCaseFlag>true</NewCaseFlag>
				<CaseDetails> 
					<RequestType>Add</RequestType> 
					<Category>${data.sourceSystemID.Category}</Category> 
					<Subcategory>${data.sourceSystemID.Sub_Category}</Subcategory> 
					<RequesterInfo> 
						<UserID>OCSUSER1</UserID> 
						<Name>OCSUSER1</Name> 
						<Phone></Phone> 
					</RequesterInfo> 
					<CaseSource>PHONE</CaseSource> 
					<Status>New</Status> 
				</CaseDetails> 
				<TicketDetails> 
					<DispatchDt>${data.sourceSystemID.formattedDispatchDate}T09:00:00</DispatchDt> 
					<SwappableFlag>${data.sourceSystemID.Swappable_Flag}</SwappableFlag> 
					<ServiceTicketLine> 
						<MASServiceLineID>1</MASServiceLineID> 
						<Quantity>1</Quantity> 
						<DispatchReasonCd>${data.sourceSystemID.Sub_Category}</DispatchReasonCd> 
						<MASContainerClassCd></MASContainerClassCd> 
						<ContainerSize></ContainerSize> 
						<MASWasteType>${data.sourceSystemID.Waste_Type}</MASWasteType> 
					</ServiceTicketLine> 
				</TicketDetails> 
				<CaseLog> 
					<InternalCommentFlag>true</InternalCommentFlag> 
					<InternalCommentLine>AutomationTestingTicketComments</InternalCommentLine> 
				</CaseLog> 
			</MASCase> 
		</tns:MASCreateUpdateCasesRequest> 
	</SOAP-ENV:Body> 
</SOAP-ENV:Envelope>`;
};
