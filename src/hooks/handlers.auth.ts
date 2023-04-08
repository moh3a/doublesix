import {
  EmailAuthProvider,
  createUserWithEmailAndPassword,
  deleteUser,
  linkWithCredential,
  signInAnonymously,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from "firebase/auth";

import { auth } from "../config/firebase.config";
import {
  DeleteAccountHandlerParams,
  SignInHandlerParams,
  SignOutHandlerParams,
} from "../types";

export const anonymousSignInHandler = async () => {
  const user = await signInAnonymously(auth);
  await updateProfile(user.user, {
    photoURL: `https://avatars.dicebear.com/api/bottts/${user.user.uid}.svg`,
  });
};

export const signInHandler = async (params: SignInHandlerParams) => {
  if (params.action !== "LINK") {
    try {
      if (auth.currentUser && auth.currentUser.isAnonymous)
        await deleteUser(auth.currentUser);
      else await signOut(auth);
    } catch (error) {
      if (error.code === "auth/requires-recent-login") {
        await signOut(auth);
      } else console.log(error);
    }
  }
  if (params.email && params.password) {
    if (
      auth.currentUser &&
      auth.currentUser.isAnonymous &&
      params.action === "LINK"
    ) {
      try {
        const credential = EmailAuthProvider.credential(
          params.email,
          params.password
        );
        const userCredentials = await linkWithCredential(
          auth.currentUser,
          credential
        );
        if (userCredentials.user) {
          await updateProfile(userCredentials.user, {
            displayName: params.username,
            photoURL: `https://avatars.dicebear.com/api/bottts/${params.username}.svg`,
          });
        }
      } catch (error) {
        if (error.code === "auth/email-already-in-use") {
          params.setTimedMessage({
            type: "error",
            text: "Email address already in use.",
            duration: 3000,
          });
        } else console.log(error);
      }
    } else if (!auth.currentUser && params.action === "CREATE") {
      const userCredentials = await createUserWithEmailAndPassword(
        auth,
        params.email,
        params.password
      );
      if (userCredentials.user) {
        await updateProfile(userCredentials.user, {
          displayName: params.username,
          photoURL: `https://avatars.dicebear.com/api/bottts/${params.username}.svg`,
        });
      }
    } else if (!auth.currentUser && params.action === "LOGIN") {
      try {
        await signInWithEmailAndPassword(auth, params.email, params.password);
      } catch (error) {
        if (error.code === "auth/user-not-found") {
          params.setTimedMessage({
            type: "error",
            text: "User not found.",
            duration: 3000,
          });
        } else console.log(error);
      }
    }
  }
  params.setOpen(false);
};

export const signOutHandler = async (params: SignOutHandlerParams) => {
  try {
    if (auth.currentUser && auth.currentUser.isAnonymous)
      await deleteUser(auth.currentUser);
    else await signOut(auth);
  } catch (error) {
    if (error.code === "auth/requires-recent-login") {
      await signOut(auth);
    } else console.log(error);
  }
  params.resetGame();
  params.resetRound();
  params.resetPlayers();
  params.resetHand();
  params.navigation.navigate("Home");
};

export const deleteAccountHandler = async (
  params: DeleteAccountHandlerParams
) => {
  try {
    await deleteUser(auth.currentUser);
    params.resetGame();
    params.resetRound();
    params.resetPlayers();
    params.resetHand();
    params.navigation.navigate("Home");
  } catch (error) {
    if (error.code === "auth/requires-recent-login") {
      params.setTimedMessage({
        type: "error",
        text: "Account requires recent login to delete.",
        duration: 3000,
      });
    } else console.log(error);
  }
};
