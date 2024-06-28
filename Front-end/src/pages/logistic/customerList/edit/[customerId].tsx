import Head from "next/head";
import SidebarLayout from "@/layout/SidebarLayout";
import PageHeader from "@/content/logistic/customerList/Edit/EditCustomerListPageHeader";
import PageTitleWrapper from "@/components/PageTitleWrapper";
import { Grid, Container } from "@mui/material";
import { ReactElement } from "react";
import Breadcrumb from "@/components/Breadcrumbs";
// import EditCustomerList from "@/content/logistic/customerList/Edit/EditCustomerList";
import dynamic from "next/dynamic";

const EditCustomerList = dynamic(() => import("@/content/logistic/customerList/Edit/EditCustomerList"),{
  ssr: false  
})

function ApplicationsTransactions() {
  const pageData: string = "Home/Logistic/Edit Order";

  return (
    <>
      <Head>
        <title></title>
      </Head>
      <PageTitleWrapper>
        <Breadcrumb pageData={pageData} />
        <PageHeader />
      </PageTitleWrapper>
      <Container maxWidth="lg">
        <Grid
          container
          direction="row"
          justifyContent="center"
          alignItems="stretch"
          spacing={3}
        >
          <Grid item xs={12}>
            <EditCustomerList />
          </Grid>
        </Grid>
      </Container>
    </>
  );
}

ApplicationsTransactions.getLayout = (page: ReactElement) => (
  <SidebarLayout>{page}</SidebarLayout>
);

export default ApplicationsTransactions;
