import { useRef, useState, useEffect } from "react";

import {
  ListSubheader,
  alpha,
  Box,
  List,
  styled,
  Button,
  ListItem,
} from "@mui/material";

import DesignServicesTwoToneIcon from "@mui/icons-material/DesignServicesTwoTone";
import BrightnessLowTwoToneIcon from "@mui/icons-material/BrightnessLowTwoTone";
import MmsTwoToneIcon from "@mui/icons-material/MmsTwoTone";
import TableChartTwoToneIcon from "@mui/icons-material/TableChartTwoTone";
import AccountCircleTwoToneIcon from "@mui/icons-material/AccountCircleTwoTone";
import BallotTwoToneIcon from "@mui/icons-material/BallotTwoTone";
import BeachAccessTwoToneIcon from "@mui/icons-material/BeachAccessTwoTone";
import EmojiEventsTwoToneIcon from "@mui/icons-material/EmojiEventsTwoTone";
import FilterVintageTwoToneIcon from "@mui/icons-material/FilterVintageTwoTone";
import HowToVoteTwoToneIcon from "@mui/icons-material/HowToVoteTwoTone";
import LocalPharmacyTwoToneIcon from "@mui/icons-material/LocalPharmacyTwoTone";
import RedeemTwoToneIcon from "@mui/icons-material/RedeemTwoTone";
import SettingsTwoToneIcon from "@mui/icons-material/SettingsTwoTone";
import TrafficTwoToneIcon from "@mui/icons-material/TrafficTwoTone";
import CheckBoxTwoToneIcon from "@mui/icons-material/CheckBoxTwoTone";
import ChromeReaderModeTwoToneIcon from "@mui/icons-material/ChromeReaderModeTwoTone";
import WorkspacePremiumTwoToneIcon from "@mui/icons-material/WorkspacePremiumTwoTone";
import CameraFrontTwoToneIcon from "@mui/icons-material/CameraFrontTwoTone";
import DisplaySettingsTwoToneIcon from "@mui/icons-material/DisplaySettingsTwoTone";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import LayersIcon from "@mui/icons-material/Layers";
import InventoryIcon from "@mui/icons-material/Inventory";
import CategoryIcon from "@mui/icons-material/Category";
import DoorSlidingIcon from "@mui/icons-material/DoorSliding";
import ShareLocationTwoToneIcon from "@mui/icons-material/ShareLocationTwoTone";
import DescriptionTwoToneIcon from "@mui/icons-material/DescriptionTwoTone";
import ListAltTwoToneIcon from "@mui/icons-material/ListAltTwoTone";

import Link from "next/link";
import { useDispatch } from "react-redux";
import { sidebarIsClose } from "@/store/systemStore";
import getConfig from "next/config";
import { useRouter } from "next/router";

const { publicRuntimeConfig } = getConfig();

const MenuWrapper = styled(Box)(
  ({ theme }) => `
  .MuiList-root {
    padding: ${theme.spacing(1)};

    & > .MuiList-root {
      padding: 0 ${theme.spacing(0)} ${theme.spacing(1)};
    }
  }

    .MuiListSubheader-root {
      text-transform: uppercase;
      font-weight: bold;
      font-size: ${theme.typography.pxToRem(12)};
      color: ${theme.colors.alpha.trueWhite[50]};
      padding: ${theme.spacing(0, 2.5)};
      line-height: 1.4;
    }
`
);

const SubMenuWrapper = styled(Box)(
  ({ theme }) => `
    .MuiList-root {

      .MuiListItem-root {
        padding: 1px 0;

        .MuiBadge-root {
          position: absolute;
          right: ${theme.spacing(3.2)};

          .MuiBadge-standard {
            background: ${theme.colors.primary.main};
            font-size: ${theme.typography.pxToRem(10)};
            font-weight: bold;
            text-transform: uppercase;
            color: ${theme.palette.primary.contrastText};
          }
        }
    
        .MuiButton-root {
          display: flex;
          color: ${theme.colors.alpha.trueWhite[70]};
          background-color: transparent;
          width: 100%;
          justify-content: flex-start;
          padding: ${theme.spacing(1.2, 3)};

          .MuiButton-startIcon,
          .MuiButton-endIcon {
            transition: ${theme.transitions.create(["color"])};

            .MuiSvgIcon-root {
              font-size: inherit;
              transition: none;
            }
          }

          .MuiButton-startIcon {
            color: ${theme.colors.alpha.trueWhite[30]};
            font-size: ${theme.typography.pxToRem(20)};
            margin-right: ${theme.spacing(1)};
          }
          
          .MuiButton-endIcon {
            color: ${theme.colors.alpha.trueWhite[50]};
            margin-left: auto;
            opacity: .8;
            font-size: ${theme.typography.pxToRem(20)};
          }

          &.active,
          &:hover {
            background-color: ${alpha(theme.colors.alpha.trueWhite[100], 0.06)};
            color: ${theme.colors.alpha.trueWhite[100]};

            .MuiButton-startIcon,
            .MuiButton-endIcon {
              color: ${theme.colors.alpha.trueWhite[100]};
            }
          }
        }

        &.Mui-children {
          flex-direction: column;

          .MuiBadge-root {
            position: absolute;
            right: ${theme.spacing(7)};
          }
        }

        .MuiCollapse-root {
          width: 100%;

          .MuiList-root {
            padding: ${theme.spacing(1, 0)};
          }

          .MuiListItem-root {
            padding: 1px 0;

            .MuiButton-root {
              padding: ${theme.spacing(0.8, 3)};

              .MuiBadge-root {
                right: ${theme.spacing(3.2)};
              }

              &:before {
                content: ' ';
                background: ${theme.colors.alpha.trueWhite[100]};
                opacity: 0;
                transition: ${theme.transitions.create([
                  "transform",
                  "opacity",
                ])};
                width: 6px;
                height: 6px;
                transform: scale(0);
                transform-origin: center;
                border-radius: 20px;
                margin-right: ${theme.spacing(1.8)};
              }

              &.active,
              &:hover {

                &:before {
                  transform: scale(1);
                  opacity: 1;
                }
              }
            }
          }
        }
      }
    }
`
);

const SidebarMenu = () => {
  const dispatch = useDispatch();
  const [user, setUser] = useState([]);
  const [role, setRole] = useState([]);
  const [userRole, setUserRole] = useState<any>([]);

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
            setUser(userData.data);

            const responseRole = await fetch(
              `${publicRuntimeConfig.BackEnd}role/role-user/${userData.data.id}`,
              {
                method: "GET",
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );

            if (responseRole.ok) {
              const roleData = await responseRole.json();
              console.log("role", roleData);
              setRole(roleData.data);

              // Assuming roleData.data is an array and you want to get the first role's name
              if (roleData.data.length > 0) {
                setUserRole(roleData.data);
                console.log("User Role:", roleData.data[0].name);
              } else {
                console.error("No roles found for the user.");
              }
            } else {
              // Handle error when fetching user roles
              console.error("Error fetching Role:", responseRole.statusText);
            }
            // console.log(user.avatar);
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
    // console.log('user state:', user);
    fetchUserInfo();
  }, []);

  return (
    <>
      <MenuWrapper>
        {/* <List
          component="div"
          subheader={
            <ListSubheader component="div" disableSticky>
              Overview
            </ListSubheader>
          }
        >
          <SubMenuWrapper>
            <List component="div">
              <ListItem component="div">
                <Button
                  disableRipple
                  component={Link}
                  onClick={() => {
                    dispatch(sidebarIsClose);
                  }}
                  href="/dashboard/"
                  startIcon={<BrightnessLowTwoToneIcon />}
                >
                  Dashboards
                </Button>
              </ListItem>
            </List>
          </SubMenuWrapper>
        </List> */}
        <List
          component="div"
          subheader={
            <ListSubheader component="div" disableSticky>
              Management
            </ListSubheader>
          }
        >
          <SubMenuWrapper>
            <List component="div">
              {(userRole.some((value: any) => value.name === "Stock") ||
                userRole.some((value: any) => value.name === "Admin") ||
                userRole.some((value: any) => value.name === "Manager")) && (
                <>
                  <ListItem component="div">
                    <Button
                      disableRipple
                      component={Link}
                      onClick={() => {
                        dispatch(sidebarIsClose);
                      }}
                      href="/management/material"
                      startIcon={<BallotTwoToneIcon />}
                    >
                      Material
                    </Button>
                  </ListItem>
                </>
              )}
              {(userRole.some((value: any) => value.name === "Stock") ||
                userRole.some((value: any) => value.name === "Admin") ||
                userRole.some((value: any) => value.name === "Manager")) && (
                <>
                  <ListItem component="div">
                    <Button
                      disableRipple
                      component={Link}
                      onClick={() => {
                        dispatch(sidebarIsClose);
                      }}
                      href="/management/materialAdd"
                      startIcon={<TableChartTwoToneIcon />}
                    >
                      Add Material
                    </Button>
                  </ListItem>
                </>
              )}
              {(userRole.some((value: any) => value.name === "Stock") ||
                userRole.some((value: any) => value.name === "Admin") ||
                userRole.some((value: any) => value.name === "Manager")) && (
                <>
                  <ListItem component="div">
                    <Button
                      disableRipple
                      component={Link}
                      onClick={() => {
                        dispatch(sidebarIsClose);
                      }}
                      href="/management/pickup"
                      startIcon={<TableChartTwoToneIcon />}
                    >
                      Requisition
                    </Button>
                  </ListItem>
                </>
              )}
              {(userRole.some((value: any) => value.name === "Stock") ||
                userRole.some((value: any) => value.name === "Admin") ||
                userRole.some((value: any) => value.name === "Manager")) && (
                <>
                  <ListItem component="div">
                    <Button
                      disableRipple
                      component={Link}
                      onClick={() => {
                        dispatch(sidebarIsClose);
                      }}
                      href="/management/report"
                      startIcon={<DescriptionTwoToneIcon />}
                    >
                      Report
                    </Button>
                  </ListItem>
                </>
              )}
            </List>
          </SubMenuWrapper>
        </List>
        <List
          component="div"
          subheader={
            <ListSubheader component="div" disableSticky>
              Logistic
            </ListSubheader>
          }
        >
          <SubMenuWrapper>
            <List component="div">
              {(userRole.some((value: any) => value.name === "Delivery") ||
                userRole.some((value: any) => value.name === "Admin") ||
                userRole.some((value: any) => value.name === "Manager")) && (
                <>
                  <ListItem component="div">
                    <Button
                      disableRipple
                      component={Link}
                      onClick={() => {
                        dispatch(sidebarIsClose);
                      }}
                      href="/logistic/customerList"
                      startIcon={<ListAltTwoToneIcon />}
                    >
                      Customer Lists
                    </Button>
                  </ListItem>
                </>
              )}
              {(userRole.some((value: any) => value.name === "Delivery") ||
                userRole.some((value: any) => value.name === "Admin") ||
                userRole.some((value: any) => value.name === "Manager")) && (
                <>
                  <ListItem component="div">
                    <Button
                      disableRipple
                      component={Link}
                      onClick={() => {
                        dispatch(sidebarIsClose);
                      }}
                      href="/logistic/order"
                      startIcon={<DescriptionTwoToneIcon />}
                    >
                      Order
                    </Button>
                  </ListItem>
                </>
              )}
              {(userRole.some((value: any) => value.name === "Delivery") ||
                userRole.some((value: any) => value.name === "Admin") ||
                userRole.some((value: any) => value.name === "Manager")) && (
                <>
                  <ListItem component="div">
                    <Button
                      disableRipple
                      component={Link}
                      onClick={() => {
                        dispatch(sidebarIsClose);
                      }}
                      href="/logistic/tracking"
                      startIcon={<ShareLocationTwoToneIcon />}
                    >
                      Tracking
                    </Button>
                  </ListItem>
                </>
              )}
            </List>
          </SubMenuWrapper>
        </List>
        <List
          component="div"
          subheader={
            <ListSubheader component="div" disableSticky>
              Set Up
            </ListSubheader>
          }
        >
          <SubMenuWrapper>
            <List component="div">
              {(userRole.some((value: any) => value.name === "Admin") ||
                userRole.some((value: any) => value.name === "Manager") ||
                userRole.some((value: any) => value.name === "Stock")) && (
                <>
                  <ListItem component="div">
                    <Button
                      disableRipple
                      component={Link}
                      onClick={() => {
                        dispatch(sidebarIsClose);
                      }}
                      href="/setup/shelf/"
                      startIcon={<DoorSlidingIcon />}
                    >
                      Shelf
                    </Button>
                  </ListItem>
                </>
              )}
              {(userRole.some((value: any) => value.name === "Admin") ||
                userRole.some((value: any) => value.name === "Manager") ||
                userRole.some((value: any) => value.name === "Stock")) && (
                <>
                  <ListItem component="div">
                    <Button
                      disableRipple
                      component={Link}
                      onClick={() => {
                        dispatch(sidebarIsClose);
                      }}
                      href="/setup/unit/"
                      startIcon={<InventoryIcon />}
                    >
                      Unit of products
                    </Button>
                  </ListItem>
                </>
              )}
              {(userRole.some((value: any) => value.name === "Admin") ||
                userRole.some((value: any) => value.name === "Manager") ||
                userRole.some((value: any) => value.name === "Stock")) && (
                <>
                  <ListItem component="div">
                    <Button
                      disableRipple
                      component={Link}
                      onClick={() => {
                        dispatch(sidebarIsClose);
                      }}
                      href="/setup/materialtype"
                      startIcon={<LayersIcon />}
                    >
                      Material type
                    </Button>
                  </ListItem>
                </>
              )}
              {(userRole.some((value: any) => value.name === "Admin") ||
                userRole.some((value: any) => value.name === "Manager")) && (
                <>
                  <ListItem component="div">
                    <Button
                      disableRipple
                      component={Link}
                      onClick={() => {
                        dispatch(sidebarIsClose);
                      }}
                      href="/setup/permission"
                      startIcon={<AdminPanelSettingsIcon />}
                    >
                      User Permission
                    </Button>
                  </ListItem>
                </>
              )}
            </List>
          </SubMenuWrapper>
        </List>
      </MenuWrapper>
    </>
  );
};

export default SidebarMenu;
