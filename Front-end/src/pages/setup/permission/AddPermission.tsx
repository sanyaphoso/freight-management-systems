import Head from "next/head";
import SidebarLayout from "@/layout/SidebarLayout";
import PageHeader from "@/content/setup/permission/AddPermission/AddPreHeader";
import PageTitleWrapper from "@/components/PageTitleWrapper";
import { Grid, Container, Typography } from "@mui/material";
import { ReactElement } from "react";
import AddPermission from "@/content/setup/permission/AddPermission/AddPermission";
import Breadcrumb from "@/components/Breadcrumbs";

function ApplicationsTransactions() {
  const pageData: string = "Home/User Permission/Add Permission"; // ระบุเส้นทางของหน้าปัจจุบัน

  return (
    <>
      <Head>
        <title></title>
      </Head>
      <PageTitleWrapper>
        {/* เรียกใช้ Breadcrumb component และส่งค่า pageData */}
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
            <AddPermission />
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
