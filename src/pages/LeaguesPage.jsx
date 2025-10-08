import React, { useState, useEffect } from 'react';
import { Card, CardContent, Typography, Grid, Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { motion } from 'framer-motion';
import axios from 'axios';

const LeagueCard = ({ league, index, onDelete, onEdit }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.15 }}
    >
        <Card elevation={3} sx={{ minHeight: 100 }}>
            <CardContent>
                <Typography variant="h6">{league.name}</Typography>
                <Typography variant="body2" color="text.secondary">
                    Location: {league.location}
                </Typography>
                <Button onClick={() => onEdit(league)} size="small">Edit</Button>
                <Button onClick={() => onDelete(league.id)} size="small" color="error">Delete</Button>
            </CardContent>
        </Card>
    </motion.div>
);

const LeaguesPage = () => {
    const [leagues, setLeagues] = useState([]);
    const [open, setOpen] = useState(false);
    const [currentLeague, setCurrentLeague] = useState({ id: null, name: '', location: '' });

    const fetchLeagues = async () => {
        const response = await axios.get('http://localhost:1010/api/leagues');
        setLeagues(response.data);
    };

    const handleDelete = async (id) => {
        await axios.delete(`http://localhost:1010/api/leagues/${id}`);
        fetchLeagues();
    };

    const handleSave = async () => {
        if (currentLeague.id) {
            await axios.put(`http://localhost:1010/api/leagues/${currentLeague.id}`, currentLeague);
        } else {
            await axios.post('http://localhost:1010/api/leagues', currentLeague);
        }
        setOpen(false);
        fetchLeagues();
    };

    const handleEdit = (league) => {
        setCurrentLeague(league);
        setOpen(true);
    };

    const handleAdd = () => {
        setCurrentLeague({ id: null, name: '', location: '' });
        setOpen(true);
    };

    useEffect(() => {
        fetchLeagues();
    }, []);

    return (
        <div>
            <Button variant="contained" onClick={handleAdd} sx={{ marginBottom: 2 }}>
                Add League
            </Button>
            <Grid container spacing={3} padding={3}>
                {leagues.map((league, idx) => (
                    <Grid item xs={12} sm={6} md={4} key={league.id}>
                        <LeagueCard league={league} index={idx} onDelete={handleDelete} onEdit={handleEdit} />
                    </Grid>
                ))}
            </Grid>

            <Dialog open={open} onClose={() => setOpen(false)}>
                <DialogTitle>{currentLeague.id ? 'Edit League' : 'Add League'}</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Name"
                        fullWidth
                        value={currentLeague.name}
                        onChange={(e) => setCurrentLeague({ ...currentLeague, name: e.target.value })}
                    />
                    <TextField
                        margin="dense"
                        label="Location"
                        fullWidth
                        value={currentLeague.location}
                        onChange={(e) => setCurrentLeague({ ...currentLeague, location: e.target.value })}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpen(false)}>Cancel</Button>
                    <Button onClick={handleSave}>Save</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default LeaguesPage;
