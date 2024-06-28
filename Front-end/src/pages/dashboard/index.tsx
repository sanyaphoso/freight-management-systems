import Head from 'next/head';
import SidebarLayout from "@/layout/SidebarLayout";
import PageHeader from '@/content/dashboard/PageHeader';
import { ReactElement } from "react";
import WatchList from "@/content/dashboard/List";
import PageTitleWrapper from "@/components/PageTitleWrapper";
import Breadcrumb from "@/components/Breadcrumbs";
import { Container, Grid } from "@mui/material";

function ApplicationsTransactions() {
  const pageData: string = 'Home/Dashboard'; // ระบุเส้นทางของหน้าปัจจุบัน

  return (
    <>
      <Head>
        <title>Add Material</title>
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
          <WatchList />
          </Grid>
        </Grid>
      </Container>
    </>
  );
};

ApplicationsTransactions.getLayout = (page: ReactElement) => (
  <SidebarLayout>{page}</SidebarLayout>
);


export default ApplicationsTransactions;
