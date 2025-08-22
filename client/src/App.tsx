import React, { useEffect, useRef, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import type { PostUserFormData, User } from './libs/types/user-types';

const SERVER_HOST = import.meta.env.VITE_SERVER_HOST;
const SERVER_PORT = import.meta.env.VITE_SERVER_PORT;
const apiUrl = `http://${SERVER_HOST}:${SERVER_PORT}/api`;

function App() {
  const [count, setCount] = useState(0);

  const [data, setData] = useState<User[]>();
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [refetch, setRefetch] = useState(0); // put in useEffect and increment whenever you want to refetch

  const username = useRef<HTMLInputElement>(null);
  const email = useRef<HTMLInputElement>(null);
  const bio = useRef<HTMLTextAreaElement>(null);
  const isNoRef = !username || !email || !bio || !username.current || !email.current || !bio.current

  const resetForm = () => {
    if (!username || !email || !bio || !username.current || !email.current || !bio.current) return;

    username.current.value = "";
    email.current.value = "";
    bio.current.value = "";
  }

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      try {
        const options = {
          method: "GET",
          headers: {
            'Content-Type': "application/json"
          }
        }
        const result = await fetch(`http://${SERVER_HOST}:${SERVER_PORT}/api/users`, options)
          .then(async res => await res.json());
        setData(result);
      }
      catch (error) {
        console.error("Error Occurred: ", error);
        setError(String(error));
      }
      finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, [refetch]);

  const handleDelete = async (id: number) => {
    const formData: { id: number } = { id }

    try {
      const options = {
        method: "DELETE",
        headers: {
          'Content-Type': "application/json"
        },
        body: JSON.stringify(formData)
      };

      const result = await fetch(`${apiUrl}/users`, options);
      if (result.ok) setRefetch(prev => prev + 2);

    } catch (error) {
      console.error("Error attempting to Delete: ", error);
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!username || !email || !bio || !username.current || !email.current || !bio.current) {
      return;
    }
    const formData: PostUserFormData = {
      username: username.current.value,
      email: email.current.value,
      bio: bio.current.value
    }
    try {
      const options = {
        method: "POST",
        headers: {
          'Content-Type': "application/json"
        },
        body: JSON.stringify(formData),
      }
      await fetch(`${apiUrl}/users`, options)
        .then(async res => await res.json());

      resetForm();
      setRefetch(prev => prev + 5);
    }
    catch (error) {
      console.error("Form Error Occurred: ", error);
      setError(String(error));
    }
  }

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
      <div>
        <section>
          <h1>Testing Data</h1>
          <h2>Users</h2>
          <ul>
            {isLoading ?
              <p>Loading...</p>
              :
              data && data.map((user, index) => (
                <React.Fragment key={index}>
                  <h3>Username: <u>{user.username}</u></h3>
                  <button type='button' onClick={() => handleDelete(user.id)}><i>delete</i></button>
                  <li>Email: {user.email}</li>
                  <li>Bio: {user.bio}</li>
                  <li>Id: {user.id}</li>
                  <li>Meme_id: {String(user.meme_id)}</li>
                </React.Fragment>
              ))}
          </ul>
        </section>

        <hr />

        <section>
          {/* Testing Mutation/Post */}
          <form onSubmit={handleSubmit}>
            <div>
              <label htmlFor="username">Username</label>
              <input
                ref={username}
                type="text"
                id='username'
                placeholder='Ex: wasgudChat'
                required
              />
            </div>
            <div>
              <label htmlFor="email">Email</label>
              <input
                ref={email}
                type="email"
                id='email'
                placeholder='Ex: ISeeYou@behindyou.com'
                required
              />
            </div>
            <div>
              <label htmlFor="bio">Bio</label>
              <textarea
                ref={bio}
              />
            </div>
            <button type="submit">
              Submit
            </button>
          </form>
        </section>

      </div>
    </>
  )
}

export default App
