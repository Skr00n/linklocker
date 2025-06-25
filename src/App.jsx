import { useState, useEffect } from 'react';
import { auth, db } from './firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';

function App() {
  const [user, setUser] = useState(null);
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [links, setLinks] = useState([{ title: '', url: '' }]);

  // Track login state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  // Update link inputs
  const handleLinkChange = (index, field, value) => {
    const updated = [...links];
    updated[index][field] = value;
    setLinks(updated);
  };

  // Add a new blank link
  const addLink = () => {
    setLinks([...links, { title: '', url: '' }]);
  };

  // Save user profile to Firestore
  const saveProfile = async () => {
    try {
      await setDoc(doc(db, 'users', user.uid), {
        name: name.trim() || 'Anonymous',
        bio,
        links,
      });
      alert('Profile saved!');
    } catch (error) {
      console.error('Error saving profile:', error);
      alert('Failed to save profile.');
    }
  };

  // Require login to view the editor
  if (!user) {
    return (
      <div style={{ padding: 20 }}>
        <p>Please <a href="/auth">log in</a> to use the editor.</p>
      </div>
    );
  }

  return (
    <div style={{ padding: 20, fontFamily: 'sans-serif' }}>
      <h1>LinkLocker</h1>
      <p>Logged in as: {user.email}</p>
      <button onClick={() => signOut(auth)} style={{ marginBottom: 20 }}>Logout</button>

      <input
        type="text"
        placeholder="Your Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        style={{ display: 'block', marginBottom: 10, padding: 8 }}
      />

      <textarea
        placeholder="Your Bio"
        value={bio}
        onChange={(e) => setBio(e.target.value)}
        style={{ display: 'block', marginBottom: 10, padding: 8, width: '100%' }}
      />

      <h2>Links</h2>
      {links.map((link, index) => (
        <div key={index} style={{ marginBottom: 10 }}>
          <input
            type="text"
            placeholder="Link Title"
            value={link.title}
            onChange={(e) => handleLinkChange(index, 'title', e.target.value)}
            style={{ marginRight: 10, padding: 6 }}
          />
          <input
            type="text"
            placeholder="Link URL"
            value={link.url}
            onChange={(e) => handleLinkChange(index, 'url', e.target.value)}
            style={{ padding: 6 }}
          />
        </div>
      ))}

      <button onClick={addLink} style={{ marginRight: 10 }}>Add New Link</button>
      <button onClick={saveProfile}>Save Profile</button>

      <h2 style={{ marginTop: 40 }}>Preview</h2>
      <h3>{name}</h3>
      <p>{bio}</p>
      <ul>
        {links.map((link, index) => (
          <li key={index}>
            <a href={link.url} target="_blank" rel="noopener noreferrer">{link.title}</a>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
