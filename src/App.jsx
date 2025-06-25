import { useState, useEffect } from 'react';
import { auth, db } from './firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';

function App() {
  const [user, setUser] = useState(null);
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [links, setLinks] = useState([{ title: '', url: '' }]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const handleLinkChange = (index, field, value) => {
    const updated = [...links];
    updated[index][field] = value;
    setLinks(updated);
  };

  const addLink = () => {
    setLinks([...links, { title: '', url: '' }]);
  };

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

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 text-gray-800">
        <p className="text-xl">Please <a href="/auth" className="text-blue-600 underline">log in</a> to use the editor.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-gray-800 p-6">
      <div className="max-w-3xl mx-auto">
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-blue-600">LinkLocker</h1>
          <p className="text-sm text-gray-600">Logged in as: {user.email}</p>
          <button
            onClick={() => signOut(auth)}
            className="mt-2 text-sm text-red-600 underline"
          >
            Logout
          </button>
        </header>

        <input
          type="text"
          placeholder="Your Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full border border-gray-300 p-3 rounded mb-4"
        />

        <textarea
          placeholder="Your Bio"
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          className="w-full border border-gray-300 p-3 rounded mb-4"
        />

        <h2 className="text-xl font-semibold mb-2">Links</h2>
        {links.map((link, index) => (
          <div key={index} className="flex flex-col md:flex-row gap-3 mb-4">
            <input
              type="text"
              placeholder="Link Title"
              value={link.title}
              onChange={(e) => handleLinkChange(index, 'title', e.target.value)}
              className="flex-1 border border-gray-300 p-2 rounded"
            />
            <input
              type="text"
              placeholder="Link URL"
              value={link.url}
              onChange={(e) => handleLinkChange(index, 'url', e.target.value)}
              className="flex-1 border border-gray-300 p-2 rounded"
            />
          </div>
        ))}

        <div className="mb-6 flex gap-4">
          <button
            onClick={addLink}
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
          >
            Add New Link
          </button>
          <button
            onClick={saveProfile}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
          >
            Save Profile
          </button>
        </div>

        <h2 className="text-xl font-semibold mt-10 mb-2">Preview</h2>
        <div className="bg-gray-50 p-4 border rounded">
          <h3 className="text-lg font-bold">{name}</h3>
          <p className="text-gray-700">{bio}</p>
          <ul className="mt-3 list-disc pl-5">
            {links.map((link, index) => (
              <li key={index}>
                <a
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 underline"
                >
                  {link.title}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default App;
