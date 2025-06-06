import * as React from "react";
import { AppBar, Box, Toolbar, Typography } from "@mui/material";
import { Link, useLocation } from "react-router-dom";
import IconButton from '@mui/material/IconButton';
import {Menu, Container, Button, MenuItem} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';

const pages = [{path : "/", name : "Home"},{path : "/form", name : "Form"}]

const Navbar = () => {
  // getting current path name
  const location = useLocation();

  const [anchorElNav, setAnchorElNav] = React.useState(null);

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  return (
    <>
     <AppBar position="static">
      <Container maxWidth="xl">
        <Toolbar disableGutters sx={{ justifyContent: "space-between" }}>
          <Typography
            variant="h6"
            noWrap
            component={Link}
            to="/"
            sx={{
              fontFamily: "monospace",
              fontWeight: 700,
              color: "inherit",
              textDecoration: "none",
              display: { xs: "none", md: "flex" }
            }}
          >
            Student App
          </Typography>
          <Box sx={{ display: { xs: "flex", md: "none" } }}>
            <IconButton
              size="large"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              anchorEl={anchorElNav}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
              transformOrigin={{ vertical: "top", horizontal: "left" }}
            >
              {pages.map((page) => (
                <MenuItem key={page.name} onClick={handleCloseNavMenu}>
                  <Link
                    to={page.path}
                    style={{
                      textDecoration: "none",
                      color:
                        location.pathname === page.path ? "#1976d2" : "black"
                    }}
                  >
                    <Typography textAlign="center">{page.name}</Typography>
                  </Link>
                </MenuItem>
              ))}
            </Menu>
          </Box>

          <Typography
            variant="h6"
            noWrap
            component={Link}
            to="/"
            sx={{
              flexGrow: 1,
              fontFamily: "monospace",
              fontWeight: 700,
              color: "inherit",
              textDecoration: "none",
              display: { xs: "flex", md: "none" }
            }}
          >
            Student App
          </Typography>

          <Box sx={{ display: { xs: "none", md: "flex" }, gap: 2 }}>
            {pages?.map((page) => (
              <Link
                key={page.name}
                to={page.path}
                style={{ textDecoration: "none" }}
              >
                <Button
                  onClick={handleCloseNavMenu}
                  sx={{
                    color:
                      location?.pathname === page?.path ? "#ffeb3b" : "white",
                    fontWeight:
                      location?.pathname === page?.path ? "bold" : "normal"
                  }}
                >
                  {page?.name}
                </Button>
              </Link>
            ))}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
    </>
  );
}

export default Navbar;
