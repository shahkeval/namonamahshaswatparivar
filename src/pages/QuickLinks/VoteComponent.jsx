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
<div className="p-4 text-center bg-white shadow rounded-lg max-w-sm mx-auto mt-10">
<h2 className="text-lg font-semibold mb-4">What do you like?</h2>
<button
className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-xl m-2 transition"
onClick={() => handleVote("optionA")}
disabled={voted}
>
Option A
</button>
<button
className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-xl m-2 transition"
onClick={() => handleVote("optionB")}
disabled={voted}
>
Option B
</button>
<div className="mt-4">
<p>Option A: {votes.optionA}</p>
<p>Option B: {votes.optionB}</p>
{voted && (
<p className="text-green-600 font-semibold mt-2">Thanks for voting!</p>
)}
</div>
</div>
);
};

export default VoteComponent;