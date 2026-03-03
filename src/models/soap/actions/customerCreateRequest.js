export const customerCreateRequest = (data) => {

   return `
        <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/">
<soapenv:Body>
<tns:MASCustomerChangeRequest xmlns:tns="http://otc.customer.integration.mas.wm.com/">
 <MASCustomer>
   <SourceSystemID>Siebel</SourceSystemID>
   <ESBTransactionID>${data.esbTransactionID}</ESBTransactionID>
   <NewCustomerFlag>True</NewCustomerFlag>
   <MASCustomerLocation>
      <LPAR />
      <LibrarySuffix>${data.sourceSystemID.customerConfig.MASlibrary}</LibrarySuffix>
      <MASCompanyCode>${data.sourceSystemID.customerConfig.companyCode}</MASCompanyCode>
   </MASCustomerLocation>
   <SourceCustomerID>${data.sourceSystemID.customerId}</SourceCustomerID>
   <MASCustomerType>${data.sourceSystemID.customerConfig.customerType}</MASCustomerType>
   <PartyRoleCd>Svc</PartyRoleCd>
   <PartyRoleCd>Bill</PartyRoleCd>
   <CustomerBiographicalInfo>
     <BillingNameLong>${data.sourceSystemID.customerBio.name}</BillingNameLong>
      <BillingContact>${data.sourceSystemID.customerBio.contact}</BillingContact>
      <BillingAddress>
         <AddrTypeCd>${data.sourceSystemID.customerBio.address.substring(0, 4)}</AddrTypeCd>
         <StreetTxt1>${data.sourceSystemID.customerBio.address}</StreetTxt1>
         <City>${data.sourceSystemID.customerBio.city}</City>
         <State>${data.sourceSystemID.customerBio.state}</State>
         <Zip>${data.sourceSystemID.customerBio.zipcode}</Zip>
         <Country>US</Country>
         <ValidAddress>true</ValidAddress>
      </BillingAddress>
     <BillingPhone>${data.sourceSystemID.customerBio.phone}</BillingPhone>
      <BillingEmail>${data.sourceSystemID.customerBio.email}</BillingEmail>
      <ServiceNameLong>${data.sourceSystemID.serviceAddress.name}</ServiceNameLong>
     <ServiceContact>${data.sourceSystemID.serviceAddress.contact}</ServiceContact>
      <ServiceAddress>
         <AddrTypeCd>${data.sourceSystemID.serviceAddress.address.substring(0, 4)}</AddrTypeCd>
         <StreetTxt1>${data.sourceSystemID.serviceAddress.address}</StreetTxt1>
         <City>${data.sourceSystemID.serviceAddress.city}</City>
         <State>${data.sourceSystemID.serviceAddress.state}</State>
         <Zip>${data.sourceSystemID.serviceAddress.zipcode}</Zip>
         <Country>US</Country>
         <ValidAddress>true</ValidAddress>
      </ServiceAddress>
      <ServicePhone>${data.sourceSystemID.serviceAddress.phone}</ServicePhone>
      <ServiceEmail>${data.sourceSystemID.serviceAddress.email}</ServiceEmail>
      <CountyCode>${data.sourceSystemID.billingInfo.countryCode}</CountyCode>
        </CustomerBiographicalInfo>
<CustomerBillingInfo>
      <BillCycle>${data.sourceSystemID.billingInfo.billingCycle}</BillCycle>
      <FinanceChargeCode>C</FinanceChargeCode>
      <StartDate>${data.sourceSystemID.billingInfo.startDate}T09:00:00</StartDate>
   </CustomerBillingInfo>
<CustomerSalesInfo>
      <ValueChangeReasonCode>NBC</ValueChangeReasonCode>
      <VCRDesc>New Bus Perm from Competitor</VCRDesc>
      <VCRDateTime>2019-03-25T17:00:00</VCRDateTime>
      <SaleforceID>S3009200560</SaleforceID>
      <HunterSalesEmployeeID>9999999999</HunterSalesEmployeeID>
	<AMPID>NOT SCORED</AMPID>
  <FarmerSalesEmployeeID>9999999998</FarmerSalesEmployeeID>
    <SICCode>1422</SICCode>
      <ContractDate>${data.sourceSystemID.billingInfo.contractDate}T09:00:00</ContractDate>
      <ContractTerm>24</ContractTerm>
      <PriceIncreaseException>false</PriceIncreaseException>
      <PIExceptionAutoRenew>12</PIExceptionAutoRenew>
   </CustomerSalesInfo>
   <CustomerCreditInfo>
      <PayMethodCd>CreditAcct</PayMethodCd>
      <RiskCode>MAApproved</RiskCode>
      <RMCID>0000</RMCID>
   </CustomerCreditInfo>
<ServiceLines>
      <ActionCd>Add</ActionCd>
      <Frequency>1</Frequency>
      <BillingQuantity>1</BillingQuantity>
      <MASServiceCd>${data.sourceSystemID.serviceLines.svc}</MASServiceCd>
      <EntMaterialCd>${data.sourceSystemID.serviceLines.wasteType}</EntMaterialCd>
      <Rate>1.00</Rate>
      <RateType>Contract</RateType>
      <TempServiceFlag>${data.sourceSystemID.serviceLines.tp}</TempServiceFlag>
      <TaxFlag>${data.sourceSystemID.serviceLines.tax}</TaxFlag>
  <SourceServiceLineItemID>2234678</SourceServiceLineItemID>
      <SourceServiceParentLineItemID></SourceServiceParentLineItemID>
      
      ${data.sourceSystemID.routes.map(route =>
      ` <Routes>
           <MASRouteCd>${route.routeCode}</MASRouteCd>
           <RouteDayName>${route.dayOfWeek}</RouteDayName> 
           </Routes> `).join('')};

 </ServiceLines> <CustomerAttributes>
      <AttributeName>CONTRTYPE</AttributeName>
      <AttributeValue>${data.sourceSystemID.billingInfo.contractType}</AttributeValue>
   </CustomerAttributes>

   <RoutingComments>testing routing amp id from SFDC</RoutingComments>
   <CustomerNotes>Special Intr: Phone: 9878977841 Customer Comments: Shashwat AMP ID TESTI</CustomerNotes>
   <CustomerNotes>NG IN MAS FROM SALESFORCE</CustomerNotes>
   <AuditCol>
      <TransactionDateTime>${data.sourceSystemID.billingInfo.startDate}T09:00:00</TransactionDateTime>
      <TransactionType>Add</TransactionType>
      <TransactionUserID>PMADIRED</TransactionUserID>
   </AuditCol>
</MASCustomer>
  </tns:MASCustomerChangeRequest>
  </soapenv:Body>
  </soapenv:Envelope>`;
};
