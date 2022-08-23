import axios from "axios";
import { useEffect, useState } from "react";
import Card from "./components/Card";
import "./styles.css";
import logs from "./data/logs.json";

const API_URL =
  "https://api.airtable.com/v0/appBTaX8XIvvr6zEC/Users?maxRecords=9&view=Grid%20view";
const TOKEN = "key4v56MUqVr9sNJv";

export default function App() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const header = { Authorization: `Bearer ${TOKEN}` };

    function getAndSetUsers() {
      let result = [];

      axios.get(API_URL, { headers: header }).then((response) => {
        result = [...response?.data?.records];

        setUsers(result);
      });
    }

    getAndSetUsers();
  }, []);

  return (
    <div className="App">
      {users.map((user) => {
        return <Card user={user} logs={logs} />;
      })}
    </div>
  );
}
