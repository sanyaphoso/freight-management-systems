import { Typography, Button, Grid } from "@mui/material";
import { useRouter } from "next/router";

function PageHeader() {
  const router = useRouter();
  return (
    <Grid container justifyContent="space-between" alignItems="center">
      <Grid item>
        <Typography variant="h3" component="h3" gutterBottom>
          Create Material Type
        </Typography>
      </Grid>
    </Grid>
  );
}

export default PageHeader;
