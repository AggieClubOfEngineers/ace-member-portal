import React from "react";

import { LockSquare, SquareArrowRight } from "tabler-icons-react";

import "../../styles/login-page.css";
import bcrypt from "bcryptjs";

const names = [
  "Adrian Guzman",
  "Aidan King",
  "Aidan Pena",
  "Alan Marini",
  "Alejandro Velasco",
  "Amrit Nanda",
  "Andrew Lin",
  "Andrew Marshall",
  "Ankit Lulla",
  "Anthony Salazar",
  "Anton Kacer",
  "Ben Brod",
  "Ben Snavely",
  "Ben White",
  "Blaze Montagne",
  "Braden Loeffler",
  "Brandon Turnage",
  "Brandon Zhao",
  "Calvin Turrell",
  "Chad Cordova",
  "Chase Albright",
  "Chris Choucair",
  "Clement Ong",
  "Connor Dunn",
  "Connor Gilliland",
  "Dakota Fathke",
  "Damon Banduk",
  "Daniel Garcia",
  "David Jackson",
  "Dohoon Kim",
  "Drew Remington",
  "Dylan Bell",
  "Eddie Villegas",
  "Eric McGonagle",
  "Erick Lemus",
  "Ethan Birdsall",
  "Gerardo Ruiz",
  "Glory Oluwole",
  "Grant Schottlekotte",
  "Grant Ward",
  "Greg Rogers",
  "Hudson Hurtig",
  "Hunter Aschen",
  "Irving Salinas",
  "Jack Bridges",
  "Jackson Norfolk",
  "Jackson Owen",
  "Jacob Hargreaves",
  "Jacob Technik",
  "Jaden Banze",
  "Jake Flores",
  "Jake Segers",
  "Jess Holbert",
  "John Hayes",
  "Jon Vanwagenen",
  "Jonathan Kutsch",
  "Joseph Valenta",
  "Joshua Mayhugh",
  "Juan Ardila",
  "Juan Nerio",
  "Julian Pollina",
  "Justen Pearl",
  "Kenneth Gentry",
  "Kyle Dessens",
  "Lance Torno",
  "Landon Miller",
  "Lane Thomae",
  "Lucas Giammona",
  "Lucas Swoyer",
  "Luis Calvo",
  "Luke Sciba",
  "Luke Smith",
  "Manuel PanDavila",
  "Mark Thiele",
  "Mason Joyner",
  "Mateo Cerna",
  "Matthew Graham",
  "Matthew Oakland",
  "Micaiah Wood",
  "Moses Monty",
  "Nate Mathews",
  "Nathan Casazza",
  "Nathan Weiblen",
  "Nick Bodenheimer",
  "Nick Caso",
  "Nick Dittemore",
  "Nick Moreno",
  "Nick Mozyrsky",
  "Nicolas Rogstad",
  "Nils Ljung",
  "Obi Chinemerem",
  "Parker Briney",
  "Patrick Martin",
  "Peyton Knight",
  "Peyton Woytek",
  "Preston Greenwood",
  "Reed Huffmyer",
  "Ryan Ozelton",
  "Ryan Riddle",
  "Scott Trouy",
  "Sebastian Coronado",
  "Sid Venkatraman",
  "Tyler Powell",
  "Tyler Woods",
  "Van Wilcox",
  "Vinny LoBello",
  "Whitten Bowles",
  "Zach Podraza",
  "Zach Tacobucci",
];

import { useState } from "react";
import db from "../../config";

import { getDoc, doc } from "firebase/firestore";

function LoginPage({ setMember }) {
  const [username, setUsername] = useState(names[0]);
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const handleLogin = async (event) => {
    event.preventDefault();

    const docRef = doc(db, "users", username);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data();
      // Use bcrypt's compare function to check if the provided password matches the stored hash
      if (await bcrypt.compare(password, data.hashedPassword)) {
        setMember({ memberId: username, role: data.role });
        setError(null);
      } else {
        setError("Incorrect Password");
      }
    } else {
      setError("User does not exist");
    }
  };

  return (
    <div className="login-container">
      <LockSquare className="login-icon" strokeWidth={0.5} color={"#123456"} />
      <h1 className="login-title">Login</h1>
      <form className="login-form" onSubmit={handleLogin}>
        <select
          name="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        >
          {names &&
            names.map((name) => (
              <option value={name} key={name}>
                {name}
              </option>
            ))}
        </select>
        <label>
          Password
          <input
            type="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>
        {error && <div className="error">Incorrect Password</div>}
        <div className="submit-button-container" onClick={handleLogin}>
          <SquareArrowRight
            className="login-button-icon"
            strokeWidth={2}
            color={"#123456"}
          />
        </div>
      </form>
    </div>
  );
}

export default LoginPage;
