import React, { useEffect, useState } from "react";
import axios from "axios";
import {
    Card,
    CardContent,
    Typography,
    CircularProgress,
    Grid,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    TextField,
    Snackbar,
    Alert,
    Select,
    MenuItem,
    InputLabel,
    FormControl,
    Avatar,
    CardHeader,
    Box, // Added Box for layout
} from "@mui/material";
import { motion } from "framer-motion";

// --- Styles ---
const styles = {
    page: {
        minHeight: "100vh",
        padding: { xs: 2, md: 4 },
        background: "linear-gradient(135deg, #2c3e50, #4a546e)",
        fontFamily: "'Segoe UI', 'Roboto', sans-serif",
    },
    header: {
        textAlign: "center",
        color: "#a88beb",
        marginBottom: "30px",
        fontSize: { xs: '2rem', md: '2.5rem' },
        fontWeight: 'bold',
    },
    primaryButton: {
        padding: "12px 30px",
        background: "linear-gradient(90deg, #6f00ff, #9f55ff)",
        color: "#fff",
        borderRadius: "10px",
        fontWeight: "bold",
        transition: "transform 0.2s, box-shadow 0.2s",
        boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
        "&:hover": {
            transform: "scale(1.05)",
            boxShadow: '0 6px 20px rgba(159, 85, 255, 0.4)',
        },
    },
    playerCard: {
        borderRadius: "20px",
        background: "rgba(255, 255, 255, 0.1)",
        backdropFilter: "blur(10px)",
        border: "1px solid rgba(255, 255, 255, 0.2)",
        boxShadow: "0 8px 32px 0 rgba(0, 0, 0, 0.37)",
        color: "#f0f0f0",
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
    },
    cardHeader: {
        '.MuiCardHeader-title': {
            fontWeight: 'bold',
            fontSize: '1.25rem',
        },
        '.MuiCardHeader-subheader': {
            color: 'rgba(255, 255, 255, 0.7)',
        }
    },
    cardActions: {
        marginTop: 'auto', // Pushes actions to the bottom
        padding: '16px',
        display: 'flex',
        justifyContent: 'space-between',
    },
    dialogPaper: {
        borderRadius: "20px",
        background: "rgba(44, 62, 80, 0.9)", // Darker glass for better focus
        backdropFilter: "blur(15px)",
        border: "1px solid rgba(255, 255, 255, 0.2)",
        color: "#f0f0f0",
    },
    dialogTextField: {
        marginBottom: '16px',
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
        },
        '& .MuiInputLabel-root': {
            color: 'rgba(255, 255, 255, 0.5)',
        },
    },
};

const PlayersPage = () => {
    const [players, setPlayers] = useState([]);
    const [teams, setTeams] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [openDialog, setOpenDialog] = useState(false);
    const [currentPlayer, setCurrentPlayer] = useState({
        name: "", age: "", position: "", team: "", avatar: ""
    });
    const [isEditing, setIsEditing] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");

    useEffect(() => {
        const fetchAllData = async () => {
            try {
                const [playersRes, teamsRes] = await Promise.all([
                    axios.get(`http://localhost:8080/api/players`),
                    axios.get(`http://localhost:8080/api/teams`)
                ]);
                setPlayers(playersRes.data);
                setTeams(teamsRes.data);
            } catch (err) {
                setError("Failed to fetch data");
            } finally {
                setLoading(false);
            }
        };
        fetchAllData();
    }, []);

    const handleOpenDialog = (player = null) => {
        if (player) {
            setCurrentPlayer({ ...player, team: player.team ? player.team.id : "" });
            setIsEditing(true);
        } else {
            setCurrentPlayer({ name: "", age: "", position: "", team: "", avatar: "" });
            setIsEditing(false);
        }
        setOpenDialog(true);
    };

    const handleCloseDialog = () => setOpenDialog(false);

    const handleSavePlayer = async () => {
        const teamObject = teams.find(t => t.id === currentPlayer.team);
        const playerToSave = { ...currentPlayer, team: teamObject || null };
        try {
            if (isEditing) {
                await axios.put(`http://localhost:8080/api/players/${currentPlayer.id}`, playerToSave);
                setSuccessMessage("Player updated successfully!");
            } else {
                await axios.post(`http://localhost:8080/api/players`, playerToSave);
                setSuccessMessage("Player added successfully!");
            }
            const response = await axios.get(`http://localhost:8080/api/players`);
            setPlayers(response.data);
            handleCloseDialog();
        } catch (err) {
            setError("Failed to save player");
        }
    };

    const handleDeletePlayer = async (id) => {
        try {
            await axios.delete(`http://localhost:8080/api/players/${id}`);
            setSuccessMessage("Player deleted successfully!");
            setPlayers(players.filter(p => p.id !== id));
        } catch (err) {
            setError("Failed to delete player");
        }
    };

    if (loading) {
        return <Box sx={{ ...styles.page, display: "flex", justifyContent: "center", alignItems: "center" }}>
            <CircularProgress sx={{ color: "#a88beb" }} />
        </Box>;
    }

    if (error) {
        return <Box sx={{ ...styles.page, display: "flex", justifyContent: "center", alignItems: "center" }}>
            <Typography color="error">{error}</Typography>
        </Box>;
    }

    return (
        <Box sx={styles.page}>
            <Typography variant="h4" sx={styles.header}>
                Players Management
            </Typography>
            <Box sx={{ display: "flex", justifyContent: "center", mb: 4 }}>
                <Button sx={styles.primaryButton} onClick={() => handleOpenDialog()}>
                    Add Player
                </Button>
            </Box>
            <Grid container spacing={4}>
                {players.map((player) => (
                    <Grid item xs={12} sm={6} md={4} key={player.id}>
                        <motion.div whileHover={{ y: -10 }} transition={{ type: "spring", stiffness: 300 }} style={{ height: '100%' }}>
                            <Card sx={styles.playerCard}>
                                <CardHeader
                                    sx={styles.cardHeader}
                                    avatar={<Avatar src={player.avatar || ""} alt={player.name} sx={{ width: 60, height: 60, bgcolor: 'rgba(255,255,255,0.2)' }} />}
                                    title={player.name || "Unknown Player"}
                                    subheader={`Team: ${player.team?.name || "No Team"}`}
                                />
                                <CardContent>
                                    <Typography variant="body2" sx={{ opacity: 0.8 }}>Age: {player.age || "N/A"}</Typography>
                                    <Typography variant="body2" sx={{ opacity: 0.8 }}>Position: {player.position || "Unknown"}</Typography>
                                </CardContent>
                                <Box sx={styles.cardActions}>
                                    <Button variant="outlined" color="secondary" onClick={() => handleOpenDialog(player)}>Edit</Button>
                                    <Button variant="outlined" color="error" onClick={() => handleDeletePlayer(player.id)}>Delete</Button>
                                </Box>
                            </Card>
                        </motion.div>
                    </Grid>
                ))}
            </Grid>

            <Dialog open={openDialog} onClose={handleCloseDialog} PaperProps={{ sx: styles.dialogPaper }}>
                <DialogTitle sx={{ color: '#a88beb', fontWeight: 'bold' }}>{isEditing ? "Edit Player" : "Add New Player"}</DialogTitle>
                <DialogContent>
                    <TextField label="Name" fullWidth value={currentPlayer.name} onChange={(e) => setCurrentPlayer({ ...currentPlayer, name: e.target.value })} sx={styles.dialogTextField} />
                    <TextField label="Age" fullWidth type="number" value={currentPlayer.age} onChange={(e) => setCurrentPlayer({ ...currentPlayer, age: e.target.value })} sx={styles.dialogTextField} />
                    <TextField label="Position" fullWidth value={currentPlayer.position} onChange={(e) => setCurrentPlayer({ ...currentPlayer, position: e.target.value })} sx={styles.dialogTextField} />
                    <TextField label="Avatar URL" fullWidth value={currentPlayer.avatar} onChange={(e) => setCurrentPlayer({ ...currentPlayer, avatar: e.target.value })} sx={styles.dialogTextField} />
                    <FormControl fullWidth sx={styles.dialogTextField}>
                        <InputLabel>Team</InputLabel>
                        <Select
                            label="Team"
                            value={currentPlayer.team}
                            onChange={(e) => setCurrentPlayer({ ...currentPlayer, team: e.target.value })}
                        >
                            <MenuItem value=""><em>None</em></MenuItem>
                            {teams.map((team) => (
                                <MenuItem key={team.id} value={team.id}>{team.name}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </DialogContent>
                <DialogActions sx={{ padding: '16px 24px' }}>
                    <Button onClick={handleCloseDialog} color="error">Cancel</Button>
                    <Button onClick={handleSavePlayer} sx={{ color: '#a88beb', fontWeight: 'bold' }}>Save</Button>
                </DialogActions>
            </Dialog>

            <Snackbar open={!!successMessage} autoHideDuration={4000} onClose={() => setSuccessMessage("")} anchorOrigin={{ vertical: "bottom", horizontal: "center" }}>
                <Alert onClose={() => setSuccessMessage("")} severity="success" variant="filled" sx={{ width: "100%" }}>
                    {successMessage}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default PlayersPage;