import { useRef, useState, useEffect } from "react";
import {
  Avatar,
  Box,
  Button,
  Divider,
  Hidden,
  lighten,
  List,
  ListItem,
  ListItemText,
  Popover,
  Typography,
} from "@mui/material";

import InboxTwoToneIcon from "@mui/icons-material/InboxTwoTone";
import { styled } from "@mui/material/styles";
import ExpandMoreTwoToneIcon from "@mui/icons-material/ExpandMoreTwoTone";
import AccountBoxTwoToneIcon from "@mui/icons-material/AccountBoxTwoTone";
import LockOpenTwoToneIcon from "@mui/icons-material/LockOpenTwoTone";
import AccountTreeTwoToneIcon from "@mui/icons-material/AccountTreeTwoTone";
import Link from "next/link";
import getConfig from "next/config";
import { useRouter } from "next/router";

const { publicRuntimeConfig } = getConfig();

const UserBoxButton = styled(Button)(
  ({ theme }) => `
        padding-left: ${theme.spacing(1)};
        padding-right: ${theme.spacing(1)};
`
);

const MenuUserBox = styled(Box)(
  ({ theme }) => `
        background: ${theme.colors.alpha.black[5]};
        padding: ${theme.spacing(2)};
`
);

const UserBoxText = styled(Box)(
  ({ theme }) => `
        text-align: left;
        padding-left: ${theme.spacing(1)};
`
);

const UserBoxLabel = styled(Typography)(
  ({ theme }) => `
        font-weight: ${theme.typography.fontWeightBold};
        color: ${theme.palette.secondary.main};
        display: block;
`
);

const UserBoxDescription = styled(Typography)(
  ({ theme }) => `
        color: ${lighten(theme.palette.secondary.main, 0.5)}
`
);

function HeaderUserbox() {
  const router = useRouter();
  const [user, setUser] = useState({
    name: "",
    avatar: "",
  });

  const ref = useRef<any>(null);
  // const [isOpen, setOpen] = useState<boolean>(false);
  const [isOpen, setOpen] = useState(false);
  const [image, setImage] = useState<Blob | undefined>(undefined);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        if (token) {
          const response = await fetch(
            `${publicRuntimeConfig.BackEnd}users/user-info`,
            {
              method: "GET",
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          if (response.ok) {
            const userData = await response.json();
            console.log("ok", userData);
            setUser({
              name: userData.data.full_name,
              avatar: userData.data.image_url,
            });

            const responseImage = await fetch(
              `${publicRuntimeConfig.BackEnd}upload/${userData.data.image_url}`,
              {
                method: "GET",
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );

            if (responseImage.ok) {
              const imageData = await responseImage.blob(); // หรือ responseImage.text() ตามที่เหมาะสม
              console.log("image", imageData);
              setImage(imageData);
            } else {
              console.error("Error fetching image:", responseImage.statusText);
            }
          } else if (response.status === 401) {
            // Token หมดอายุหรือไม่ถูกต้อง
            console.log("Token expired or invalid");
            // ทำการลบ token ที่หมดอายุจาก localStorage
            localStorage.removeItem("accessToken");
          } else {
            // Handle error when fetching user info
            console.error("Error fetching user info:", response.statusText);
          }
        }
      } catch (error) {
        console.error("Error fetching user info:", error);
      }
    };

    fetchUserInfo();
  }, []);

  const handleOpen = (): void => {
    setOpen(true);
  };

  const handleClose = (): void => {
    setOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    router.push("/auth/login"); // หรือ path ที่คุณต้องการ
  };

  return (
    <>
      <UserBoxButton color="secondary" onClick={handleOpen}>
        <Avatar
          variant="rounded"
          src={image ? URL.createObjectURL(image) : ""}
        />
        <Hidden mdDown>
          <UserBoxText>
            <UserBoxLabel variant="body1">{user.name}</UserBoxLabel>
          </UserBoxText>
        </Hidden>
        <Hidden smDown>
          <ExpandMoreTwoToneIcon sx={{ ml: 1 }} />
        </Hidden>
      </UserBoxButton>
      <Popover
        // anchorEl={ref.current}
        onClose={handleClose}
        open={isOpen}
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        <MenuUserBox sx={{ minWidth: 210 }} display="flex">
          <Avatar
            variant="rounded"
            alt={user.name}
            src={image ? URL.createObjectURL(image) : ""}
          />
          <UserBoxText>
            <UserBoxLabel variant="body1">{user.name}</UserBoxLabel>
          </UserBoxText>
        </MenuUserBox>
        <Divider sx={{ mb: 0 }} />
        <List sx={{ p: 1 }} component="nav">
          <ListItem href="/user" component={Link}>
            <AccountBoxTwoToneIcon fontSize="small" />
            <ListItemText primary="My Profile" />
          </ListItem>
          {/* <ListItem href="/dashboards/messenger" component={Link}>
            <InboxTwoToneIcon fontSize="small" />
            <ListItemText primary="Messenger" />
          </ListItem>
          <ListItem href="/management/profile/settings" component={Link}>
            <AccountTreeTwoToneIcon fontSize="small" />
            <ListItemText primary="Account Settings" />
          </ListItem> */}
        </List>
        <Divider />
        <Box sx={{ m: 1 }}>
          <Button color="primary" fullWidth onClick={handleLogout}>
            <LockOpenTwoToneIcon sx={{ mr: 1 }} />
            LogOut
          </Button>
        </Box>
      </Popover>
    </>
  );
}

export default HeaderUserbox;
