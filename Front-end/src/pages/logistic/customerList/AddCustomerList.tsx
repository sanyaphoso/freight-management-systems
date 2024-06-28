import Head from "next/head";
import SidebarLayout from "@/layout/SidebarLayout";
import PageHeader from "@/content/setup/shelf/ShelfPageHeader";
import PageTitleWrapper from "@/components/PageTitleWrapper";
import { Grid, Container, Typography } from "@mui/material";

import { ReactElement } from "react";
import Breadcrumb from "@/components/Breadcrumbs";
import dynamic from "next/dynamic";

const Forms = dynamic(() => import("@/content/logistic/customerList/AddCustomerList"),{
  ssr: false
})

function ApplicationsTransactions() {
  const pageData: string = "Home/Logistic/Customer List/Add Order"; // ระบุเส้นทางของหน้าปัจจุบัน

  return (
    <>
      <Head>
        <title></title>
      </Head>

      <Container maxWidth="lg">
        <Grid item padding={3}>
          <Breadcrumb pageData={pageData} />

          <Typography variant="h3">Add Order</Typography>
        </Grid>
        <Grid
          container
          direction="row"
          justifyContent="center"
          alignItems="stretch"
          spacing={3}
        >
          <Grid item xs={12}>
            <Forms />
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
