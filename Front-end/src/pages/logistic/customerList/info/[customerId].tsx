import Head from "next/head";
import SidebarLayout from "@/layout/SidebarLayout";
import PageHeader from "@/content/logistic/customerList/Info/ViewCusHeader";
import PageTitleWrapper from "@/components/PageTitleWrapper";
import { Grid, Container } from "@mui/material";
import { ReactElement } from "react";
import Breadcrumb from "@/components/Breadcrumbs";
import ViewCustomerList from "@/content/logistic/customerList/Info/ViewCustomerList";

function ApplicationsTransactions() {
  const pageData: string = "Home/Logistic/Order Info";

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
            <ViewCustomerList />
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
