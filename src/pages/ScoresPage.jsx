import React, { useEffect, useState } from "react";
import axios from "axios";
import {
    Card,
    CardContent,
    Typography,
    Button,
    TextField,
    Grid,
    Box,
    CircularProgress,
    Snackbar,
    Alert,
    Autocomplete,
    Paper, // Import Paper for custom dropdown
} from "@mui/material";
import { motion } from "framer-motion";

// --- Styles ---
const styles = {
    page: {
        minHeight: "100vh",
        padding: { xs: 2, md: 4 },
        background: "linear-gradient(135deg, #2c3e50, #4a546e)",
        fontFamily: "'Segoe UI', 'Roboto', sans-serif",
        color: '#f0f0f0',
    },
    header: {
        color: "#a88beb",
        marginBottom: "1rem",
        fontWeight: 'bold',
    },
    glassCard: {
        padding: '24px',
        borderRadius: "20px",
        background: "rgba(255, 255, 255, 0.1)",
        backdropFilter: "blur(10px)",
        border: "1px solid rgba(255, 255, 255, 0.2)",
        boxShadow: "0 8px 32px 0 rgba(0, 0, 0, 0.37)",
        color: "#f0f0f0",
        height: '100%',
    },
    themedTextField: {
        '& label.Mui-focused': {
            color: '#a88beb',
        },
        '& .MuiOutlinedInput-root': {
            color: '#f0f0f0',
            '& fieldset': {
                borderColor: 'rgba(255, 255, 255, 0.3)',
            },
            '&:hover fieldset': {
                borderColor: 'rgba(255, 255, 255, 0.5)',
            },
            '&.Mui-focused fieldset': {
                borderColor: '#a88beb',
            },
            // Style for Autocomplete dropdown arrow
            '& .MuiSvgIcon-root': {
                color: 'rgba(255, 255, 255, 0.7)',
            },
        },
        '& .MuiInputLabel-root': {
            color: 'rgba(255, 255, 255, 0.5)',
        },
    },
    primaryButton: {
        background: "linear-gradient(90deg, #6f00ff, #9f55ff)",
        color: "#fff",
        borderRadius: "10px",
        fontWeight: "bold",
        padding: '10px 20px',
        transition: "transform 0.2s, box-shadow 0.2s",
        "&:hover": {
            transform: "scale(1.05)",
            boxShadow: '0 4px 15px rgba(159, 85, 255, 0.4)',
        },
    },
    // Custom styled Paper component for Autocomplete dropdown
    autocompletePaper: (props) => (
        <Paper 
            {...props}
            sx={{
                background: "rgba(44, 62, 80, 0.9)",
                backdropFilter: "blur(10px)",
                color: "#f0f0f0",
                borderRadius: '10px',
                border: "1px solid rgba(255, 255, 255, 0.2)",
            }}
        />
    )
};

const ScoresPage = () => {
    const [matches, setMatches] = useState([]);
    const [selectedMatch, setSelectedMatch] = useState(null);
    const [updatedScore, setUpdatedScore] = useState({ scoreTeamA: 0, scoreTeamB: 0 });
    const [loading, setLoading] = useState(true);
    const [newMatch, setNewMatch] = useState({ name: "", date: "" });
    const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
    
    // NOTE: Using placeholder API endpoints. Replace with your actual endpoints.
    const API_BASE_URL = "http://localhost:1010/api/livescore";

    useEffect(() => {
        fetchMatches();
    }, []);

    const fetchMatches = () => {
        setLoading(true);
        axios.get(`${API_BASE_URL}/matches`)
            .then((response) => setMatches(Array.isArray(response.data) ? response.data : []))
            .catch(() => setSnackbar({ open: true, message: "Error fetching matches", severity: "error" }))
            .finally(() => setLoading(false));
    };

    const fetchMatchDetails = (matchId) => {
        setLoading(true);
        axios.get(`${API_BASE_URL}/match/${matchId}`)
            .then((response) => {
                setSelectedMatch(response.data);
                setUpdatedScore({
                    scoreTeamA: response.data.scoreTeamA || 0,
                    scoreTeamB: response.data.scoreTeamB || 0,
                });
            })
            .catch(() => setSnackbar({ open: true, message: "Error fetching match details", severity: "error" }))
            .finally(() => setLoading(false));
    };
    
    // ... (other handlers: handleScoreUpdate, handleDeleteMatch, handleAddMatch remain the same but with API_BASE_URL)

    return (
        <Box sx={styles.page}>
            <Typography variant="h4" sx={{...styles.header, textAlign: 'center', mb: 4}}>
                Live Score Management
            </Typography>

            <Autocomplete
                options={matches}
                getOptionLabel={(option) => option.name || ""}
                onChange={(event, value) => value && fetchMatchDetails(value.id)}
                PaperComponent={styles.autocompletePaper}
                renderInput={(params) => (
                    <TextField
                        {...params}
                        label="Search & Select a Match"
                        sx={{ ...styles.themedTextField, mb: 4 }}
                    />
                )}
            />

            <Grid container spacing={4}>
                {/* Left Panel: Selected Match Details */}
                <Grid item xs={12} md={6}>
                     <Typography variant="h5" sx={styles.header}>Match Details</Typography>
                     <Box sx={styles.glassCard}>
                        {loading && <Box sx={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%'}}><CircularProgress sx={{ color: "#a88beb" }} /></Box>}
                        {!loading && !selectedMatch && (
                            <Typography sx={{textAlign: 'center', opacity: 0.7, mt: 4}}>
                                Select a match to view its details and update the score.
                            </Typography>
                        )}
                        {selectedMatch && (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                                <Typography variant="h6" sx={{fontWeight: 'bold'}}>
                                    {selectedMatch.match?.name || 'Match Name'}
                                </Typography>
                                <Typography variant="h3" sx={{my: 2, textAlign: 'center'}}>
                                    {selectedMatch.scoreTeamA} - {selectedMatch.scoreTeamB}
                                </Typography>
                                <Typography variant="body1" sx={{opacity: 0.8}}>
                                    <strong>Status:</strong> {selectedMatch.currentStatus}
                                </Typography>
                                
                                <Box sx={{ mt: 4 }}>
                                    <Typography variant="h6" gutterBottom sx={{fontWeight: 'bold'}}>Update Score</Typography>
                                    <Grid container spacing={2}>
                                        <Grid item xs={6}>
                                            <TextField fullWidth label="Team A Score" type="number" value={updatedScore.scoreTeamA} onChange={(e) => setUpdatedScore({ ...updatedScore, scoreTeamA: e.target.value })} sx={styles.themedTextField} />
                                        </Grid>
                                        <Grid item xs={6}>
                                            <TextField fullWidth label="Team B Score" type="number" value={updatedScore.scoreTeamB} onChange={(e) => setUpdatedScore({ ...updatedScore, scoreTeamB: e.target.value })} sx={styles.themedTextField} />
                                        </Grid>
                                    </Grid>
                                    <Button sx={{...styles.primaryButton, mt: 2}} fullWidth>
                                        Update Score
                                    </Button>
                                </Box>
                            </motion.div>
                        )}
                    </Box>
                </Grid>
                
                {/* Right Panel: Add Match */}
                <Grid item xs={12} md={6}>
                    <Typography variant="h5" sx={styles.header}>Add New Match</Typography>
                    <Box sx={styles.glassCard}>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={6}>
                                <TextField fullWidth label="Match Name" value={newMatch.name} onChange={(e) => setNewMatch({ ...newMatch, name: e.target.value })} sx={styles.themedTextField} />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField fullWidth label="Match Date" type="date" InputLabelProps={{ shrink: true }} value={newMatch.date} onChange={(e) => setNewMatch({ ...newMatch, date: e.target.value })} sx={styles.themedTextField} />
                            </Grid>
                        </Grid>
                        <Button sx={{...styles.primaryButton, mt: 2}} fullWidth>
                            Add Match
                        </Button>
                    </Box>
                </Grid>
            </Grid>

            <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={() => setSnackbar({ ...snackbar, open: false })}>
                <Alert severity={snackbar.severity} variant="filled" onClose={() => setSnackbar({ ...snackbar, open: false })}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default ScoresPage;