import Head from 'next/head';
import { Container, Grid } from "@mui/material";
import SignUp from '@/content/autentication/SignUp';

function ApplicationsTransactions() {

  return (
    <>
      <Head>
        <title>Sign Up</title>
      </Head>
      <Container maxWidth="lg">
        <Grid
          container
          direction="row"
          justifyContent="center"
          alignItems="stretch"
          spacing={3}
        >
          <Grid item xs={12}>
          <SignUp />
          </Grid>
        </Grid>
      </Container>
    </>
  );
};

export default ApplicationsTransactions;
