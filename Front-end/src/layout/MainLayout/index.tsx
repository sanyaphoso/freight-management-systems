import { useTheme } from "@emotion/react";
import { Box } from "@mui/material";

interface Props {
  children: React.ReactNode;
}

const MainLayout = ({ children }: Props) => {
  const theme = useTheme();
  return (
    <Box
      sx={{
        display: 'flex',
        flex: 1,
        height: '100%'
      }}
    >
      {children}
    </Box>
  );
};

export default MainLayout;

