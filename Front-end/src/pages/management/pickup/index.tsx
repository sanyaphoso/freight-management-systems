import Head from 'next/head';
import SidebarLayout from '@/layout/SidebarLayout';
import PageHeader from '@/content/management/pequisition/PageHeader';
import Breadcrumb from '@/components/Breadcrumbs';
import PageTitleWrapper from '@/components/PageTitleWrapper';
import { Grid, Container } from '@mui/material';
import { ReactElement } from 'react';
import Pickup from '@/content/management/pequisition/pickup'

function ApplicationsTransactions() {

  const pageData: string = 'Home/Requisition'; // ระบุเส้นทางของหน้าปัจจุบัน

  return (
    <>
      <Head>
        <title>Withdraw Material</title>
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
            <Pickup />
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