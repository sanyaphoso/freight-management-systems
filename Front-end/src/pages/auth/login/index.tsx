import Head from 'next/head';
import { Container, Grid } from "@mui/material";
import SignIn from '@/content/autentication/SignIn';
function ApplicationsTransactions() {

  return (
    <>
      <Head>
        <title>Sign In</title>
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
          <SignIn />
          </Grid>
        </Grid>
      </Container>
    </>
  );
};

export default ApplicationsTransactions;
