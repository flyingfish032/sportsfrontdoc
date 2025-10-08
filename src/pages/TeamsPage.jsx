import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaEdit, FaTrash } from "react-icons/fa";
import axios from "axios";

// --- Styles Object ---
const styles = {
    page: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        background: '#3a3a5a', // Fallback color
        backgroundImage: 'linear-gradient(135deg, #2c3e50, #4a546e)',
        fontFamily: "'Segoe UI', 'Roboto', 'Helvetica Neue', Arial, sans-serif",
        padding: '20px',
        color: '#f0f0f0',
    },
    container: {
        width: '100%',
        maxWidth: '800px',
        padding: '40px',
        borderRadius: '20px',
        // Glassmorphism effect
        background: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
    },
    header: {
        textAlign: 'center',
        color: '#a88beb', // A nice purple from the theme
        marginBottom: '30px',
        fontSize: '2.5rem',
    },
    inputGroup: {
        marginBottom: '20px',
        display: 'flex',
        flexWrap: 'wrap',
        gap: '15px',
    },
    input: {
        padding: '12px 15px',
        borderRadius: '10px',
        background: 'rgba(0, 0, 0, 0.2)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        color: '#fff',
        fontSize: '1rem',
        flex: 1,
    },
    button: {
        padding: '12px 25px',
        background: 'linear-gradient(90deg, #6f00ff, #9f55ff)',
        color: '#fff',
        border: 'none',
        borderRadius: '10px',
        cursor: 'pointer',
        fontSize: '1rem',
        fontWeight: 'bold',
        transition: 'transform 0.2s',
    },
    teamList: {
        listStyle: 'none',
        padding: 0,
    },
    teamItem: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '15px',
        marginBottom: '10px',
        background: 'rgba(0, 0, 0, 0.2)',
        borderRadius: '10px',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        boxShadow: '0 2px 5px rgba(0, 0, 0, 0.2)',
    },
    iconButton: {
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        color: '#c4a7f5',
        fontSize: '1.1rem',
        transition: 'color 0.2s',
    },
    saveButton: {
        padding: '8px 15px',
        backgroundColor: '#28a745',
        color: '#fff',
        border: 'none',
        borderRadius: '8px',
        cursor: 'pointer',
    }
};

const TeamsPage = () => {
    const [teams, setTeams] = useState([]);
    const [players, setPlayers] = useState([]);
    const [newTeam, setNewTeam] = useState("");
    const [selectedPlayer, setSelectedPlayer] = useState("");
    const [editingIndex, setEditingIndex] = useState(null);
    const [editingName, setEditingName] = useState("");

    useEffect(() => {
        axios.get("http://localhost:1010/api/teams")
            .then((response) => setTeams(response.data))
            .catch((error) => console.error("Error fetching teams:", error));
        axios.get("http://localhost:1010/api/players")
            .then((response) => setPlayers(response.data))
            .catch((error) => console.error("Error fetching players:", error));
    }, []);

    const isPlayerInTeam = (playerName) => {
        return teams.some((team) =>
            team.players.some((player) => player.name === playerName)
        );
    };

    const addTeam = () => {
        if (!newTeam.trim()) {
            alert("Team name cannot be empty.");
            return;
        }
        if (!selectedPlayer) {
            alert("Please select a player.");
            return;
        }
        if (isPlayerInTeam(selectedPlayer)) {
            const confirm = window.confirm(
                `${selectedPlayer} is already in a team. Do you want to move them to this team?`
            );
            if (!confirm) return;
        }
        const teamData = {
            name: newTeam,
            players: [{ name: selectedPlayer }],
        };
        axios.post("http://localhost:1010/api/teams", teamData)
            .then((response) => {
                setTeams([...teams, response.data]);
                setNewTeam("");
                setSelectedPlayer("");
            })
            .catch((error) => console.error("Error adding team:", error));
    };

    const deleteTeam = (id) => {
        axios.delete(`http://localhost:1010/api/teams/${id}`)
            .then(() => {
                setTeams(teams.filter((team) => team.id !== id));
            })
            .catch((error) => console.error("Error deleting team:", error));
    };

    const startEditing = (index) => {
        setEditingIndex(index);
        setEditingName(teams[index].name);
    };

    const saveEdit = () => {
        const updatedTeam = { ...teams[editingIndex], name: editingName };
        axios.put(`http://localhost:1010/api/teams/${updatedTeam.id}`, updatedTeam)
            .then((response) => {
                const updatedTeams = [...teams];
                updatedTeams[editingIndex] = response.data;
                setTeams(updatedTeams);
                setEditingIndex(null);
                setEditingName("");
            })
            .catch((error) => console.error("Error updating team:", error));
    };

    return (
        <div style={styles.page}>
            <div style={styles.container}>
                <h1 style={styles.header}>Teams Management</h1>
                <div style={styles.inputGroup}>
                    <input
                        type="text"
                        placeholder="Enter team name"
                        value={newTeam}
                        onChange={(e) => setNewTeam(e.target.value)}
                        style={styles.input}
                    />
                    <select
                        value={selectedPlayer}
                        onChange={(e) => setSelectedPlayer(e.target.value)}
                        style={styles.input}
                    >
                        <option value="">Select a player</option>
                        {players.map((player) => (
                            <option key={player.id} value={player.name}>
                                {player.name}
                            </option>
                        ))}
                    </select>
                    <button onClick={addTeam} style={styles.button}>
                        Add Team
                    </button>
                </div>
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                >
                    {teams.length === 0 ? (
                        <p style={{ textAlign: "center", color: "#bbb" }}>No teams added yet.</p>
                    ) : (
                        <ul style={styles.teamList}>
                            {teams.map((team, index) => (
                                <motion.li
                                    key={team.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.3 }}
                                    style={styles.teamItem}
                                >
                                    {editingIndex === index ? (
                                        <input
                                            type="text"
                                            value={editingName}
                                            onChange={(e) => setEditingName(e.target.value)}
                                            style={{...styles.input, marginRight: '10px'}}
                                        />
                                    ) : (
                                        <span>{team.name}</span>
                                    )}
                                    <div style={{ display: "flex", gap: "15px", alignItems: 'center' }}>
                                        {editingIndex === index ? (
                                            <button onClick={saveEdit} style={styles.saveButton}>
                                                Save
                                            </button>
                                        ) : (
                                            <button
                                                onClick={() => startEditing(index)}
                                                style={styles.iconButton}
                                                onMouseOver={(e) => e.currentTarget.style.color = '#fff'}
                                                onMouseOut={(e) => e.currentTarget.style.color = '#c4a7f5'}
                                            >
                                                <FaEdit />
                                            </button>
                                        )}
                                        <button
                                            onClick={() => deleteTeam(team.id)}
                                            style={{...styles.iconButton, color: '#ff7b7b'}}
                                            onMouseOver={(e) => e.currentTarget.style.color = '#ff4d4d'}
                                            onMouseOut={(e) => e.currentTarget.style.color = '#ff7b7b'}
                                        >
                                            <FaTrash />
                                        </button>
                                    </div>
                                </motion.li>
                            ))}
                        </ul>
                    )}
                </motion.div>
            </div>
        </div>
    );
};

export default TeamsPage;