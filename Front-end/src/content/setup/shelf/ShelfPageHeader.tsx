import { Typography, Button, Grid } from "@mui/material";
import { useRouter } from "next/router";

function PageHeader() {
  const router = useRouter();

  return (
    <Grid container justifyContent="space-between" alignItems="center">
      <Grid item>
        <Typography variant="h3" component="h3" gutterBottom>
          Shelf
        </Typography>
      </Grid>

      <Grid item>
        <Button
          variant="contained"
          sx={{ margin: 1 }}
          onClick={() => {
            router.push("/setup/shelf/AddShelf/");
          }}
          disableRipple
          component="a"
        >
          + Create Shelf{" "}
        </Button>
      </Grid>
    </Grid>
  );
}

export default PageHeader;
