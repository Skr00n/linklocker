import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { db } from './firebase';
import { doc, getDoc } from 'firebase/firestore';

function PublicProfile() {
  const { username } = useParams();
  const [data, setData] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      const docRef = doc(db, 'users', username);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setData(docSnap.data());
      } else {
        setData({ error: 'User not found' });
      }
    };

    loadData();
  }, [username]);

  if (!data) return <p>Loading...</p>;
  if (data.error) return <p>{data.error}</p>;

  return (
    <div style={{ padding: 20 }}>
      <h1>{data.name}</h1>
      <p>{data.bio}</p>
      <ul>
        {data.links.map((link, i) => (
          <li key={i}>
            <a href={link.url} target="_blank" rel="noreferrer">
              {link.title}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default PublicProfile;
