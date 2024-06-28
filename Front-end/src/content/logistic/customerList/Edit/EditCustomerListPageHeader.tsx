import { Typography, Button, Grid } from "@mui/material";

import { useRouter } from "next/router";

function PageHeader() {
  const router = useRouter();
  const user = {
    name: "Catherine Pike",
    avatar: "/static/images/avatars/1.jpg",
  };
  return (
    <Grid container justifyContent="space-between" alignItems="center">
      <Grid item>
        <Typography variant="h3" component="h3" gutterBottom>
        Edit Order
        </Typography>
      </Grid>
    </Grid>
  );
}

export default PageHeader;
