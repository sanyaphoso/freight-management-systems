import Head from "next/head";
import SidebarLayout from "@/layout/SidebarLayout";
import PageHeader from "@/content/setup/material/AddMaterialType/PageHeader";
import PageTitleWrapper from "@/components/PageTitleWrapper";
import { Grid, Container, Typography } from "@mui/material";
import { ReactElement } from "react";
import AddMaterial from "@/content/setup/material/AddMaterialType/AddMaterial";
import Breadcrumb from "@/components/Breadcrumbs";

function ApplicationsTransactions() {
  const pageData: string = "Home/Material Type/Create Material Type"; // ระบุเส้นทางของหน้าปัจจุบัน

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
            <AddMaterial />
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
