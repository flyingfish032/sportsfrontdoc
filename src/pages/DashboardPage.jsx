// src/pages/DashboardPage.jsx
import { Grid, Paper, Typography, Box } from '@mui/material';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import axios from 'axios';

const cardVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: (i) => ({
        opacity: 1,
        scale: 1,
        transition: { delay: i * 0.2, type: 'spring', stiffness: 100 },
    }),
};

const DashboardPage = () => {
    const [liveScores, setLiveScores] = useState([]);
    const [upcomingMatches, setUpcomingMatches] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('http://localhost:8080/api/matches');
                setLiveScores(response.data); // Assuming live matches are part of the response
                setUpcomingMatches(response.data); // Assuming upcoming matches are part of the response
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" gutterBottom color="primary" textAlign="center">
                Admin Dashboard
            </Typography>

            {/* Live Scores Section */}
            <Typography variant="h5" gutterBottom>
                Live Matches
            </Typography>
            <Grid container spacing={3}>
                {liveScores.map((match, index) => (
                    <Grid item xs={12} sm={6} key={match.id}>
                        <motion.div
                            custom={index}
                            initial="hidden"
                            animate="visible"
                            variants={cardVariants}
                        >
                            <Paper
                                elevation={4}
                                sx={{
                                    p: 3,
                                    textAlign: 'center',
                                    background: 'linear-gradient(135deg, #f3e5f5, #e1bee7)',
                                }}
                            >
                                <Typography variant="h6">
                                    {match.teamA.name} vs {match.teamB.name}
                                </Typography>
                                <Typography variant="body1" color="textSecondary">
                                    Venue: {match.venue}
                                </Typography>
                            </Paper>
                        </motion.div>
                    </Grid>
                ))}
            </Grid>

            {/* Upcoming Matches Section */}
            <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
                Upcoming Matches
            </Typography>
            <Grid container spacing={3}>
                {upcomingMatches.map((match, index) => (
                    <Grid item xs={12} sm={6} key={match.id}>
                        <motion.div
                            custom={index}
                            initial="hidden"
                            animate="visible"
                            variants={cardVariants}
                        >
                            <Paper
                                elevation={4}
                                sx={{
                                    p: 3,
                                    textAlign: 'center',
                                    background: 'linear-gradient(135deg, #e3f2fd, #bbdefb)',
                                }}
                            >
                                <Typography variant="h6">
                                    {match.teamA.name} vs {match.teamB.name}
                                </Typography>
                                <Typography variant="body1" color="textSecondary">
                                    Venue: {match.venue}
                                </Typography>
                            </Paper>
                        </motion.div>
                    </Grid>
                ))}
            </Grid>
    </Box>
    );
};

export default DashboardPage;
