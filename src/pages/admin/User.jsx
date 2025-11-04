import React from "react";
import SpiderChart from "../Prueba/SpiderChart";
import { getFirestore, doc, setDoc, serverTimestamp, collection } from "firebase/firestore";
import db from "../../services/Firebase";
function User({ user }) {
  
  useEffect(() => {
  // Ensure user and user.resultado exist before attempting to save
  if (!user?.uid || !user?.resultado) {
    console.log("Skipping save: User or resultado is missing.");
    return;
  }

  // Extract the unique identifier for this submission, which is your date string
  const submissionId = user.resultado.id;
  if (!submissionId) {
    console.error("Submission ID (date) is missing from user.resultado. Cannot save history.");
    return;
  }

  const saveHistoricalResultado = async () => {
    try {
      // 1. Create a new object for the data to store in the subcollection
      // This ensures we don't store the 'id' twice (once as doc ID, once as field)
      const dataToSave = {
        ...user.resultado, // Copy all fields from the result
        id: undefined, // Explicitly remove the 'id' field from the document's content
        createdAt: serverTimestamp() // Add a server timestamp for creation/sorting
      };
      delete dataToSave.id; // Ensure 'id' is removed if it was a property

      // 2. Reference the specific document in the 'submissions' subcollection
      // This path will be: users/{user.uid}/submissions/{submissionId}
      const submissionDocRef = doc(db, "users", user.uid, "submissions", submissionId);

      // 3. Use setDoc to create or overwrite this specific historical record
      await setDoc(submissionDocRef, dataToSave);

      console.log(`Historical submission for ${submissionId} saved successfully for user ${user.uid}`);
    } catch (err) { // Catch the error specifically as 'any' for type safety
      console.error("Failed to save historical resultado:", err);
      // You can also check for specific error codes if needed, e.g., if (err.code === "permission-denied")
    }
  };

  saveHistoricalResultado();
// The dependency array is crucial. We only want this to run when these values change.
}, [user?.uid, user?.resultado]); // Now it triggers when the user's ID or the result changes
  
  return (
    <div>
      {user.resultado  ? (
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
