import React, { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import "./EmailsList.css"; // External CSS for dark and light mode styles

const EmailsList = () => {
  const [emails, setEmails] = useState([]);
  const [loading, setLoading] = useState(true); // New loading state
  const [, dark] = useOutletContext();

  useEffect(() => {
    // Fetch emails from the backend API
    const fetchEmails = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/subscriptions");
        if (response.ok) {
          const data = await response.json();
          setEmails(data); // Set the emails data from the response
        } else {
          console.error("Failed to fetch emails");
        }
      } catch (error) {
        console.error("Error fetching emails:", error);
      }
    };

    fetchEmails();

    // Set loading to false after a delay to simulate loading
    setTimeout(() => {
      setLoading(false);
    }, 900); // Set loading to false after 900ms
  }, []);

  return (
    <div className={`emails-list-container ${dark ? "dark" : ""}`}>
      {loading ? (
        <div className="admin">  <h1>Loading Emails...</h1> </div> // Display loading message while emails are being fetched
      ) : emails.length === 0 ? (
        <div className="admin">  <h1>No Emails Found</h1>  </div> // Display no emails message if the list is empty
      ) : (
        <>
          <h2 className="emails-list-heading">Email List</h2>
          <div className="emails-table-container">
            <table className="emails-table">
              <thead>
                <tr className="emails-table-header">
                  <th>Sr No.</th>
                  <th>ID</th>
                  <th>Email Address</th>
                </tr>
              </thead>
              <tbody>
                {emails.map((emailObj, index) => (
                  <tr key={emailObj.id} className="emails-table-row">
                    <td>{index + 1}</td>
                    <td>{emailObj.id}</td>
                    <td>{emailObj.email}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
};

export default EmailsList;


