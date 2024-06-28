import Head from "next/head";
import SidebarLayout from "@/layout/SidebarLayout";
import PageTitle from "@/components/PageTitle";
import { ReactElement, useState } from "react";

import PageTitleWrapper from "@/components/PageTitleWrapper";
import {
  Container,
  Grid,
  Card,
  CardHeader,
  CardContent,
  Divider,
  Button,
  styled,
  Avatar,
  IconButton,
  Link,
} from "@mui/material";
import Footer from "@/components/Footer";

import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import { pink } from "@mui/material/colors";
import Checkbox from "@mui/material/Checkbox";

import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";

import Stack from "@mui/material/Stack";
import Slider from "@mui/material/Slider";
import VolumeDown from "@mui/icons-material/VolumeDown";
import VolumeUp from "@mui/icons-material/VolumeUp";

import Switch from "@mui/material/Switch";
import NextLink from "next/link";
import router from "next/router";
import UploadTwoToneIcon from "@mui/icons-material/UploadTwoTone";
import { Upload } from "@mui/icons-material";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import Paper from "@mui/material/Paper";
import { useRouter } from "next/router";

const label = { inputProps: { "aria-label": "Switch demo" } };

const currencies = [
  {
    value: "USD",
    label: "$",
  },
  {
    value: "EUR",
    label: "€",
  },
  {
    value: "BTC",
    label: "฿",
  },
  {
    value: "JPY",
    label: "¥",
  },
];

const AvatarWrapper = styled(Card)(
  ({ theme }) => `

    position: relative;
    overflow: visible;
    display: inline-block;
    margin-top: -${theme.spacing(7)};
    margin-left: ${theme.spacing(2)};

    .MuiAvatar-root {
      width: ${theme.spacing(25)};
      height: ${theme.spacing(25)};
    }
`
);
const Input = styled("input")({
  display: "none",
});
const ButtonUploadWrapper = styled(Box)(
  ({ theme }) => `
    position: absolute;
    width: ${theme.spacing(4)};
    height: ${theme.spacing(4)};
    bottom: -${theme.spacing(1)};
    right: -${theme.spacing(1)};

    .MuiIconButton-root {
      border-radius: 100%;
      background: ${theme.colors.primary.main};
      color: ${theme.palette.primary.contrastText};
      box-shadow: ${theme.colors.shadows.primary};
      width: ${theme.spacing(4)};
      height: ${theme.spacing(4)};
      padding: 0;
  
      &:hover {
        background: ${theme.colors.primary.dark};
      }
    }
`
);
const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));

function Forms() {
  const router = useRouter();
  // const currentRoute = router.pathname;

  const [currency, setCurrency] = useState("EUR");

  const handleChange = (event: any) => {
    setCurrency(event.target.value);
  };

  const [value, setValue] = useState(30);

  const handleChange2 = (_event: any, newValue: any) => {
    setValue(newValue);
  };

  return (
    <>
      <Head>
        <title></title>
      </Head>

      <Container maxWidth="lg">
        <Grid container spacing={0}>
          <Grid item xs={12} direction="column" justifyContent="center">
            <Card>
              <CardHeader title="Order Details" />
              <Divider />
              <CardContent>
                <Box
                  component="form"
                  sx={{
                    "& .MuiTextField-root": { m: 1, width: "60ch" },
                  }}
                  noValidate
                  autoComplete="off"
                >
                  <div>
                    <Grid item>
                      {" "}
                      <TextField
                        required
                        id="outlined-required"
                        label="Customer Name"
                      />
                      <TextField
                        required
                        id="outlined-required"
                        label="Details"
                      />
                      <TextField
                        required
                        id="outlined-required"
                        label="Address"
                      />
                      <TextField required id="outlined-required" label="Date" />
                    </Grid>

                    <Grid container justifyContent={"center"} paddingTop={2}>
                      {/* <NextLink href="/logistic/customerList/" passHref> */}
                      <Button
                        variant="contained"
                        sx={{ margin: 1 }}
                        // className={
                        //   currentRoute === "/logistic/customerList/" ? "active" : ""
                        // }
                        onClick={() => router.push("/logistic/order/")}
                        disableRipple
                        component="a"
                      >
                        Save{" "}
                      </Button>
                      {/* </NextLink> */}
                      {/* <NextLink href="/logistic/customerList//" passHref> */}
                      <Button
                        variant="contained"
                        sx={{ margin: 1 }}
                        color="error"
                        // className={
                        //   currentRoute === "/logistic/customerList/" ? "active" : ""
                        // }
                        onClick={() => router.push("/logistic/order/")}
                        disableRipple
                        component="a"
                      >
                        Cancel{" "}
                      </Button>
                      {/* </NextLink> */}
                    </Grid>
                  </div>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </>
  );
}

Forms.getLayout = (page: ReactElement) => <SidebarLayout>{page}</SidebarLayout>;

export default Forms;
