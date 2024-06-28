import { Typography, Button, Grid } from "@mui/material";

import AddTwoToneIcon from "@mui/icons-material/AddTwoTone";
import router from "next/router";
import NextLink from "next/link";
import { useRouter } from "next/router";

function PageHeader() {
  const router = useRouter();
  // const currentRoute = router.pathname;
  const user = {
    name: "Catherine Pike",
    avatar: "/static/images/avatars/1.jpg",
  };
  return (
    <Grid container justifyContent="space-between" alignItems="center">
      <Grid item>
        <Typography variant="h3" component="h3" gutterBottom>
        Customer List
        </Typography>
        {/* <Typography variant="subtitle2">
          {user.name}, these are your recent transactions
        </Typography> */}
      </Grid>

      <Grid item>
        {/* <NextLink href="/logistic/customerList/AddCustomerList/" passHref> */}
        <Button
          variant="contained"
          sx={{ margin: 1 }}
          // className={currentRoute === "/logistic/customerList/AddCustomerList/" ? "active" : ""}
          disableRipple
          component="a"
          onClick={() => router.push("/logistic/customerList/AddCustomerList/")}
          // onClick={closeSidebar}
          // startIcon={<TableChartTwoToneIcon />}
        >
          + Order{" "}
        </Button>
        {/* </NextLink> */}
      </Grid>
    </Grid>
  );
}

export default PageHeader;
