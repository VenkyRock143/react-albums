import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css'; // Import the CSS file

const App = () => {
    const [albums, setAlbums] = useState([]);
    const [newAlbumTitle, setNewAlbumTitle] = useState('');
    const [editAlbumId, setEditAlbumId] = useState(null);
    const [editAlbumTitle, setEditAlbumTitle] = useState('');
// This is the base url for fecting all data from api
    const API_URL = 'https://jsonplaceholder.typicode.com/albums';

// Runs fetchAlbums once when the component mounts to fetch the album list.
    useEffect(() => {
        fetchAlbums();
    }, []);

// By using this we can get the data from API_URL and for simplicity i am fetching only first 15 albums
    const fetchAlbums = async () => {
        try {
            const response = await axios.get(API_URL);
            setAlbums(response.data.slice(0, 15)); // Fetch only the first 10 albums
        } catch (error) {
            console.error('Failed to fetch albums:', error);
        }
    };

// By using this we can add albums.    
    const addAlbum = async () => {
        if (!newAlbumTitle) return alert('Album title is required!');
        try {
            const response = await axios.post(API_URL, { title: newAlbumTitle, userId: 1 });
            setAlbums([...albums, response.data]);
            setNewAlbumTitle('');
        } catch (error) {
            console.error('Failed to add album:', error);
        }
    };

// By using this we can update the ablums by using edit button
    const updateAlbum = async (id) => {
        if (!editAlbumTitle) return alert('Updated album title is required!');
        try {
            const response = await axios.put(`${API_URL}/${id}`, { title: editAlbumTitle, userId: 1 });
            setAlbums(albums.map(album => (album.id === id ? { ...album, title: response.data.title } : album)));
            setEditAlbumId(null);
            setEditAlbumTitle('');
        } catch (error) {
            console.error('Failed to update album:', error);
        }
    };

// By using this we can delete the ablums by using delete button    
    const deleteAlbum = async (id) => {
        try {
            await axios.delete(`${API_URL}/${id}`);
            setAlbums(albums.filter(album => album.id !== id));
        } catch (error) {
            console.error('Failed to delete album:', error);
        }
    };

    return (
      // This is the input field to add new album
        <div className="app-container">
            <h1>Album Manager</h1>

            <div className="add-album-section">
                <input
                    type="text"
                    placeholder="Enter album title"
                    value={newAlbumTitle}
                    onChange={(e) => setNewAlbumTitle(e.target.value)}
                />
                <button onClick={addAlbum}>Add Album</button>
            </div>

            {/* Maps through the albums state and renders each album. */}
            <ul className="album-list">
                {albums.map((album) => (
                    <li key={album.id} className="album-item">
                        {editAlbumId === album.id ? (
                            <div className="edit-album">
                                <input
                                    type="text"
                                    value={editAlbumTitle}
                                    onChange={(e) => setEditAlbumTitle(e.target.value)}
                                />
                                <button onClick={() => updateAlbum(album.id)}>Save</button>
                                <button onClick={() => setEditAlbumId(null)}>Cancel</button>
                            </div>
                        ) : (
                            <div className="album-details">
                                <span>{album.title}</span>
                                <div className="album-actions">
                                    <button onClick={() => { setEditAlbumId(album.id); setEditAlbumTitle(album.title); }}>
                                        Edit
                                    </button>
                                    <button onClick={() => deleteAlbum(album.id)}>Delete</button>
                                </div>
                            </div>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default App;
