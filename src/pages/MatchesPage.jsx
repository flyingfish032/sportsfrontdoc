import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Grid,
  Button,
  Card,
  CardContent,
} from "@mui/material";
import { motion } from "framer-motion";
import axios from "axios";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

// --- Styles ---
const styles = {
  page: {
    minHeight: "100vh",
    padding: { xs: 2, md: 4 },
    background: "linear-gradient(135deg, #2c3e50, #4a546e)",
    fontFamily: "'Segoe UI', 'Roboto', sans-serif",
    color: '#f0f0f0',
  },
  glassCard: {
    padding: { xs: '2rem', md: '2.5rem' },
    borderRadius: "20px",
    background: "rgba(255, 255, 255, 0.1)",
    backdropFilter: "blur(10px)",
    border: "1px solid rgba(255, 255, 255, 0.2)",
    boxShadow: "0 8px 32px 0 rgba(0, 0, 0, 0.37)",
  },
  header: {
    fontWeight: "bold",
    color: "#a88beb",
    marginBottom: "1.5rem",
    textAlign: "center",
  },
  input: {
    width: "100%",
    padding: "12px 15px",
    borderRadius: "10px",
    background: "rgba(0, 0, 0, 0.2)",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    color: "#fff",
    fontSize: "1rem",
    marginBottom: '1rem',
    boxSizing: 'border-box', // Ensures padding doesn't affect width
  },
  primaryButton: {
    marginTop: 2,
    width: "100%",
    padding: "12px",
    borderRadius: "10px",
    color: "#fff",
    fontWeight: "bold",
    background: "linear-gradient(90deg, #6f00ff, #9f55ff)",
    transition: 'transform 0.2s ease-in-out',
    "&:hover": {
      background: "linear-gradient(90deg, #9f55ff, #6f00ff)",
      transform: 'scale(1.02)',
    },
    "&:disabled": {
        background: 'rgba(0,0,0,0.2)',
        color: 'rgba(255,255,255,0.3)',
    }
  },
  dndContainer: {
    minHeight: 250,
    height: '100%',
    borderRadius: 2,
    backgroundColor: "rgba(0, 0, 0, 0.2)",
    padding: 1,
  },
  dndItem: {
    padding: "8px",
    marginBottom: "8px",
    borderRadius: 1,
    background: 'rgba(170, 139, 235, 0.4)', // Purple accent
    color: "#fff",
    textAlign: "center",
  },
  matchCard: {
    borderRadius: "16px",
    cursor: "pointer",
    background: "rgba(255, 255, 255, 0.1)",
    backdropFilter: "blur(10px)",
    border: "1px solid rgba(255, 255, 255, 0.2)",
    color: "#fff",
    transition: "transform 0.3s ease, box-shadow 0.3s ease",
    "&:hover": {
      boxShadow: "0 10px 30px rgba(170, 139, 235, 0.4)",
      transform: "translateY(-5px)",
    },
  },
};

const MatchesPage = () => {
  const [teams, setTeams] = useState([]);
  const [matches, setMatches] = useState([]);
  const [players, setPlayers] = useState([]);
  const [teamA, setTeamA] = useState([]);
  const [teamB, setTeamB] = useState([]);
  const [teamAName, setTeamAName] = useState("");
  const [teamBName, setTeamBName] = useState("");
  const [newMatch, setNewMatch] = useState({
    title: "",
    matchDate: "",
    venue: "",
  });

  const navigate = useNavigate();

  useEffect(() => {
    fetchMatches();
    fetchTeams();
    fetchPlayers();
  }, []);

  const fetchMatches = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/matches");
      setMatches(response.data);
    } catch (error) {
      console.error("Error fetching matches:", error);
    }
  };

  const fetchTeams = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/teams");
      setTeams(response.data);
    } catch (error) {
      console.error("Error fetching teams:", error);
    }
  };

  const fetchPlayers = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/players");
      setPlayers(response.data);
    } catch (error) {
      console.error("Error fetching players:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewMatch({ ...newMatch, [name]: value });
  };

  const onDragEnd = (result) => {
    const { source, destination } = result;
    if (!destination) return;

    // Logic to move items between lists
    let sourceList;
    let destList;
    let setSourceList;
    let setDestList;

    const getList = (id) => {
        if (id === 'players') return [players, setPlayers];
        if (id === 'teamA') return [teamA, setTeamA];
        return [teamB, setTeamB];
    };

    [sourceList, setSourceList] = getList(source.droppableId);
    [destList, setDestList] = getList(destination.droppableId);
    
    const newSourceList = [...sourceList];
    const [movedItem] = newSourceList.splice(source.index, 1);

    if (source.droppableId === destination.droppableId) {
        newSourceList.splice(destination.index, 0, movedItem);
        setSourceList(newSourceList);
    } else {
        const newDestList = [...destList];
        newDestList.splice(destination.index, 0, movedItem);
        setSourceList(newSourceList);
        setDestList(newDestList);
    }
  };

  const createMatch = async () => {
    if (teamA.length < 11 || teamB.length < 11) {
      alert("Both teams must have at least 11 players.");
      return;
    }

    try {
      await axios.post("http://localhost:8080/api/matches", {
        title: newMatch.title,
        matchDate: newMatch.matchDate,
        venue: newMatch.venue,
        teamAId: teamAName,
        teamBId: teamBName,
        teamAPlayers: teamA.map((player) => player.id),
        teamBPlayers: teamB.map((player) => player.id),
      });
      fetchMatches();
      setNewMatch({ title: "", matchDate: "", venue: "" });
      setTeamA([]);
      setTeamB([]);
    } catch (error) {
      console.error("Error creating match:", error);
    }
  };

  const handleMatchClick = (matchId) => {
    navigate(`/score/${matchId}`);
  };

  return (
    <Box sx={styles.page}>
      <Grid container spacing={4}>
        {/* Left: Create Match */}
        <Grid item xs={12} md={5}>
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Box sx={styles.glassCard}>
                <Typography variant="h5" sx={styles.header}>
                    Create New Match
                </Typography>

                <input type="text" placeholder="Match Title" name="title" value={newMatch.title} onChange={handleInputChange} style={styles.input} />
                <input type="date" name="matchDate" value={newMatch.matchDate} onChange={handleInputChange} style={styles.input} />
                <input type="text" placeholder="Venue" name="venue" value={newMatch.venue} onChange={handleInputChange} style={styles.input} />
                
                <DragDropContext onDragEnd={onDragEnd}>
                    <Grid container spacing={2}>
                        {/* Players */}
                        <Grid item xs={12}>
                            <Typography sx={{...styles.header, fontSize: '1.2rem', textAlign: 'left'}}>Players Pool</Typography>
                            <Droppable droppableId="players">
                                {(provided) => (
                                    <Box ref={provided.innerRef} {...provided.droppableProps} sx={styles.dndContainer}>
                                        {players.map((player, index) => (
                                            <Draggable key={player.id} draggableId={player.id.toString()} index={index}>
                                                {(provided) => (
                                                    <Box ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps} sx={styles.dndItem}>
                                                        {player.name}
                                                    </Box>
                                                )}
                                            </Draggable>
                                        ))}
                                        {provided.placeholder}
                                    </Box>
                                )}
                            </Droppable>
                        </Grid>

                        {/* Team A & B */}
                        <Grid item xs={12} sm={6}>
                            <Typography sx={{...styles.header, fontSize: '1.2rem', textAlign: 'left'}}>Team A</Typography>
                            <select value={teamAName} onChange={(e) => setTeamAName(e.target.value)} style={styles.input}>
                                <option value="" disabled>Select Team A</option>
                                {teams.map((team) => (<option key={team.id} value={team.name}>{team.name}</option>))}
                            </select>
                            <Droppable droppableId="teamA">
                                {(provided) => (
                                    <Box ref={provided.innerRef} {...provided.droppableProps} sx={styles.dndContainer}>
                                        {teamA.map((player, index) => (
                                            <Draggable key={player.id} draggableId={player.id.toString()} index={index}>
                                                {(provided) => (
                                                    <Box ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps} sx={styles.dndItem}>
                                                        {player.name}
                                                    </Box>
                                                )}
                                            </Draggable>
                                        ))}
                                        {provided.placeholder}
                                    </Box>
                                )}
                            </Droppable>
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <Typography sx={{...styles.header, fontSize: '1.2rem', textAlign: 'left'}}>Team B</Typography>
                            <select value={teamBName} onChange={(e) => setTeamBName(e.target.value)} style={styles.input}>
                                <option value="" disabled>Select Team B</option>
                                {teams.map((team) => (<option key={team.id} value={team.name}>{team.name}</option>))}
                            </select>
                            <Droppable droppableId="teamB">
                                {(provided) => (
                                    <Box ref={provided.innerRef} {...provided.droppableProps} sx={styles.dndContainer}>
                                        {teamB.map((player, index) => (
                                            <Draggable key={player.id} draggableId={player.id.toString()} index={index}>
                                                {(provided) => (
                                                    <Box ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps} sx={styles.dndItem}>
                                                        {player.name}
                                                    </Box>
                                                )}
                                            </Draggable>
                                        ))}
                                        {provided.placeholder}
                                    </Box>
                                )}
                            </Droppable>
                        </Grid>
                    </Grid>
                </DragDropContext>

                <Button onClick={createMatch} disabled={teamA.length < 11 || teamB.length < 11} sx={styles.primaryButton}>
                    Create Match
                </Button>
            </Box>
          </motion.div>
        </Grid>

        {/* Right: Existing Matches */}
        <Grid item xs={12} md={7}>
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Typography variant="h5" sx={{ ...styles.header, textAlign: 'left' }}>
              Existing Matches
            </Typography>
            <Grid container spacing={3}>
              {matches.map((match) => (
                <Grid item xs={12} sm={6} key={match.id}>
                  <Card onClick={() => handleMatchClick(match.id)} sx={styles.matchCard}>
                    <CardContent sx={{ textAlign: "center" }}>
                      <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                        {match.teamAName || "Team A"} vs {match.teamBName || "Team B"}
                      </Typography>
                      <Typography variant="body2" sx={{ mt: 1, opacity: 0.8 }}>
                        Venue: {match.venue || "TBD"}
                      </Typography>
                      <Typography variant="body2" sx={{ mt: 0.5, opacity: 0.8 }}>
                        Date: {match.matchDate || "TBD"}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </motion.div>
        </Grid>
      </Grid>
    </Box>
  );
};

export default MatchesPage;