import React, { useState, useEffect } from "react";
import {
doc,
getDoc,
setDoc,
updateDoc,
increment,
collection,
} from "firebase/firestore";
import { db } from "../../firebase"; // Make sure this path points to your firebase.js config
import './VoteComponent.css'; // Import the CSS file

const VoteComponent = () => {
const [votes, setVotes] = useState({ optionA: 0, optionB: 0 });
const [voted, setVoted] = useState(false);

// Generate or retrieve a device ID
const getDeviceId = () => {
let deviceId = localStorage.getItem("snsparivar_device_id");
if (!deviceId) {
deviceId = crypto.randomUUID();
localStorage.setItem("snsparivar_device_id", deviceId);
}
return deviceId;
};

useEffect(() => {
const fetchVotes = async () => {
const voteDocRef = doc(db, "votes", "poll1");
const voteSnap = await getDoc(voteDocRef);

if (voteSnap.exists()) {
  setVotes(voteSnap.data());
} else {
  await setDoc(voteDocRef, { optionA: 0, optionB: 0 });
}

const deviceId = getDeviceId();
const deviceVoteRef = doc(collection(voteDocRef, "deviceVotes"), deviceId);
const deviceVoteSnap = await getDoc(deviceVoteRef);

if (deviceVoteSnap.exists()) {
  setVoted(true);
}
};

fetchVotes();
}, []);

const handleVote = async (option) => {
if (voted) return;

const deviceId = getDeviceId();
const voteDocRef = doc(db, "votes", "poll1");
const deviceVoteRef = doc(collection(voteDocRef, "deviceVotes"), deviceId);
const deviceVoteSnap = await getDoc(deviceVoteRef);

if (deviceVoteSnap.exists()) {
  alert("You have already voted from this device.");
  setVoted(true);
  return;
}

await updateDoc(voteDocRef, { [option]: increment(1) });
await setDoc(deviceVoteRef, { choice: option });

const updatedSnap = await getDoc(voteDocRef);
setVotes(updatedSnap.data());
setVoted(true);
};

return (
<div className="vote-container">
<h2 className="vote-heading">What do you like?</h2>
{!voted ? (
  <>
    <button
      className="vote-button optionA"
      onClick={() => handleVote("optionA")}
      disabled={voted}
    >
      Pathsala A
    </button>
    <button
      className="vote-button optionB"
      onClick={() => handleVote("optionB")}
      disabled={voted}
    >
      Pathsala B
    </button>
  </>
) : (
  <p className="thank-you-message">You have already voted!</p>
)}
<div className="vote-count">
<p>Option A: {votes.optionA}</p>
<p>Option B: {votes.optionB}</p>
{voted && (
<p className="thank-you-message">Thanks for voting!</p>
)}
</div>
</div>
);
};

export default VoteComponent;