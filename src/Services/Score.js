import { db } from "../firebase";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";

export function getCurrentUserId() {
  const auth = getAuth();
  const user = auth.currentUser;
  if (user) {
    return user.uid;
  } else {
    throw new Error("No user is currently signed in");
  }
}

export async function updateUserScore(newScore, level) {
  try {
    const effectiveUserId = getCurrentUserId();
    const userDocRef = doc(db, "users", effectiveUserId);
    const userDoc = await getDoc(userDocRef);

    if (userDoc.exists()) {
      const currentData = userDoc.data();
      const currentScores = currentData.score || {};
      const currentLevelScore = currentScores[`Level${level}`] || 0;

      if (newScore > currentLevelScore) {
        await updateDoc(userDocRef, {
          [`score.Level${level}`]: newScore,
          lastUpdated: new Date().toISOString(),
        });
        return {
          success: true,
          message: `🎉 New high score for Level ${level}!`,
          score: newScore,
        };
      } else {
        return {
          success: false,
          message: `No new high score for Level ${level}.`,
          score: currentLevelScore,
        };
      }
    } else {
      await setDoc(userDocRef, {
        userId: effectiveUserId,
        username: getAuth().currentUser.displayName || "",
        mail: getAuth().currentUser.email || "",
        score: { [`Level${level}`]: newScore },
        gamesPlayed: 1,
        lastUpdated: new Date().toISOString(),
      });
      return {
        success: true,
        message: `🎯 First score recorded for Level ${level}`,
        score: newScore,
      };
    }
  } catch (error) {
    console.error("Error updating score:", error);
    return { success: false, message: "Error updating score", error: error.message };
  }
}

export async function getUserScore(userId = null, level = null) {
  try {
    const effectiveUserId = userId || getCurrentUserId();
    const userDocRef = doc(db, "users", effectiveUserId);
    const userDoc = await getDoc(userDocRef);

    if (userDoc.exists()) {
      const userData = userDoc.data();
      const scores = userData.score || {};
      if (level) {
        const levelScore = scores[`Level${level}`] || 0;
        return { success: true, score: levelScore, level };
      }
      return { success: true, score: scores, username: userData.username };
    } else {
      return { success: true, score: level ? 0 : {}, message: "No score record found" };
    }
  } catch (error) {
    console.error("Error getting score:", error);
    return { success: false, message: "Error retrieving score", error: error.message };
  }
}

export async function incrementGamesPlayed(userId = null) {
  try {
    const effectiveUserId = userId || getCurrentUserId();
    const userDocRef = doc(db, "users", effectiveUserId);
    const userDoc = await getDoc(userDocRef);

    if (userDoc.exists()) {
      await updateDoc(userDocRef, {
        gamesPlayed: (userDoc.data().gamesPlayed || 0) + 1,
        lastUpdated: new Date().toISOString(),
      });
    } else {
      await setDoc(userDocRef, {
        userId: effectiveUserId,
        username: getAuth().currentUser.displayName || "",
        mail: getAuth().currentUser.email || "",
        score: {},
        gamesPlayed: 1,
        lastUpdated: new Date().toISOString(),
      });
    }
    return { success: true };
  } catch (error) {
    console.error("Error incrementing games played:", error);
    return { success: false, error: error.message };
  }
}
