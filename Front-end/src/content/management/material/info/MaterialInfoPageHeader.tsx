import { Typography, Button, Grid } from "@mui/material";
import { useRouter } from "next/router";

function PageHeader() {
  const router = useRouter()

  return (
    <Grid container justifyContent="space-between" alignItems="center">
      <Grid item>
        <Typography variant="h3" component="h3" gutterBottom>
          Material Info
        </Typography>
      </Grid>

      <Grid item>
          <Button
            variant="contained"
            component="a"
            sx={{ margin: 1 }}
            onClick={() => {router.push('/management/materialAdd/');}}
            disableRipple
          >
            + Add Material{" "}
          </Button>
      </Grid>
    </Grid>
  );
}

export default PageHeader;