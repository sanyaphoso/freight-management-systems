import { Typography, Button, Grid } from "@mui/material";

import AddTwoToneIcon from "@mui/icons-material/AddTwoTone";
import router from "next/router";
import NextLink from "next/link";

function PageHeader() {
  // const currentRoute = router.pathname;
  const user = {
    name: "Catherine Pike",
    avatar: "/static/images/avatars/1.jpg",
  };
  return (
    <Grid container justifyContent="space-between" alignItems="center">
      <Grid item>
        <Typography variant="h3" component="h3" gutterBottom>
          ติดตามการจัดส่ง
        </Typography>
        {/* <Typography variant="subtitle2">
          {user.name}, these are your recent transactions
        </Typography> */}
      </Grid>

      {/* <Grid item>
        <NextLink href="/setup/category/AddCategory/" passHref>
        <Button
            variant="contained" sx={{ margin:1}}
            // className={currentRoute === "/setup/category/AddCategory/" ? "active" : ""}
            disableRipple
            component="a"
            // onClick={closeSidebar}
            // startIcon={<TableChartTwoToneIcon />}
          >
            + Create Category{" "}
          </Button>
        </NextLink>
      </Grid> */}
    </Grid>
  );
}

export default PageHeader;
