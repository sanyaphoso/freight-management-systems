import { Typography, Button, Grid } from "@mui/material";
import Link from 'next/link';
import { useRouter } from 'next/router';

function PageHeader() {
  const router = useRouter();

  return (
    <Grid container justifyContent="space-between" alignItems="center">
      <Grid item>
        <Typography variant="h3" component="h3" gutterBottom>
        Dashboard
        </Typography>
      </Grid>


      <Grid item>
        {/* <Link href="#" passHref> */}
        <Button
            variant="contained" sx={{ margin:1}}
            disableRipple
            component="a"
            onClick={() => router.push('#')}
          >
            + Dashboard{" "}
          </Button>
        {/* </Link> */}
      </Grid>
    </Grid>
  );
}

export default PageHeader;
