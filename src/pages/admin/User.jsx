import React, { useEffect } from "react";
import SpiderChart from "../Prueba/SpiderChart";
// ADD doc and setDoc imports
import { collection, addDoc, serverTimestamp, doc, setDoc } from "firebase/firestore"; 
import db from "../../services/Firebase";

function User({ user }) {
  
  useEffect(() => {
    // 1. Comprehensive Check: Only proceed if all necessary data exists
    // This is the correct way to "wait" for data in React.
    if (!user?.uid || !user?.resultado || !user.resultado.id) {
      console.log("Skipping save: User, user ID, resultado, or submission ID is missing.");
      return;
    }

    const submissionId = user.resultado.id;

    console.log(`Saving historical resultado for user ${user.uid} with submission ID ${submissionId}`);
    
    const saveHistoricalResultado = async () => {
      try {
        // Prepare the data
        const dataToSave = {
          ...user.resultado, // Copy all fields from the result
          createdAt: serverTimestamp() // Add a server timestamp
        };
        
        // IMPORTANT: Remove the 'id' field from the document body, 
        // since it is being used as the document reference ID (submissionId)
        delete dataToSave.id; 

        // Reference the specific document using submissionId as the document key
        const submissionDocRef = doc(db, "users", user.uid, "submissions", submissionId);

        // Use setDoc to create or overwrite this specific historical record
        await setDoc(submissionDocRef, dataToSave);

        console.log(`Historical submission for ${submissionId} saved successfully for user ${user.uid}`);
      } catch (err) {
        console.error("Failed to save historical resultado:", err);
      }
    };

    saveHistoricalResultado();
    
    // The dependency array is crucial. We only want this to run when these values change.
  }, [user?.uid, user?.resultado, user?.resultado?.id]); // Added user?.resultado?.id for completeness

  
  return (
    <div>
      {user.resultado ? (
        <div className="perfil-usuario">
          <img src={user.photo} alt="user" className="user-pic" />
          <SpiderChart
            className="spider"
            title={user.name}
            data={user.resultado}
          />
        </div>
      ) : (
        <></>
      )}
    </div>
  );
}

export default User;