// src/components/Navbar.jsx
import { Link } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, useTheme, useMediaQuery } from '@mui/material';
import { styled } from '@mui/system';

const AnimatedButton = styled(Button)(({ theme }) => {
    const currentTheme = useTheme();
    return {
        transition: 'transform 0.3s ease, background-color 0.3s ease',
        '&:hover': {
            transform: 'scale(1.1)',
            backgroundColor: currentTheme.palette.action.hover,
        },
    };
});

const Navbar = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    return (
        <AppBar position="static" sx={{ marginBottom: 2, background: 'var(--primary-gradient)', boxShadow: '0 6px 18px rgba(0,0,0,0.25)' }}>
            <Toolbar sx={{ color: '#fff' }}>
                <Typography variant="h6" sx={{ flexGrow: 1, color: '#fff' }}>
                    KHELO INDIA
                </Typography>
                {!isMobile && (
                    <>
                       
                        <AnimatedButton color="inherit" sx={{ color: '#fff' }} component={Link} to="/leagues">Leagues</AnimatedButton>
                        <AnimatedButton color="inherit" sx={{ color: '#fff' }} component={Link} to="/matches">Matches</AnimatedButton>
                        <AnimatedButton color="inherit" sx={{ color: '#fff' }} component={Link} to="/players">Players</AnimatedButton>
                        <AnimatedButton color="inherit" sx={{ color: '#fff' }} component={Link} to="/teams">Teams</AnimatedButton>
                        <AnimatedButton color="inherit" sx={{ color: '#fff' }} component={Link} to="/scores">Scores</AnimatedButton>
                        <AnimatedButton color="inherit" sx={{ color: '#fff' }} component={Link} to="/login">Logout</AnimatedButton>
                    </>
                )}
            </Toolbar>
        </AppBar>
    );
};

export default Navbar;
