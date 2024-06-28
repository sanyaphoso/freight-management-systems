import { Typography, Button, Grid } from "@mui/material";
import { useRouter } from 'next/router';

function PageHeader() {
  const router = useRouter();
  return (
    <Grid container justifyContent="space-between" alignItems="center">
      <Grid item>
        <Typography variant="h3" component="h3" gutterBottom>
        Material Type
        </Typography>
      </Grid>
      <Grid item>
        <Button
            variant="contained" sx={{ margin:1}}
            disableRipple
            component="a"
            onClick={() => router.push('/setup/materialtype/AddMaterial/')}>
            + Create Material{" "}
          </Button>
      </Grid>
    </Grid>
  );
}

export default PageHeader;
