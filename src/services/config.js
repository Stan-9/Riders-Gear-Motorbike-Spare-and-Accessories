import { 
  doc, 
  getDoc,
  setDoc,
  onSnapshot
} from 'firebase/firestore';
import { db } from '../firebase/config';

const settingsDoc = doc(db, 'settings', 'shop');

const result = (success, data = null, error = null) => ({ success, data, error });

export const getSettings = async () => {
  try {
    const snapshot = await getDoc(settingsDoc);
    if (snapshot.exists()) {
      return snapshot.data();
    }
    return { shopName: "Riders Gear Nairobi", whatsappNumber: "254716778794" };
  } catch (error) {
    console.error("Error fetching settings: ", error);
    return { shopName: "Riders Gear Nairobi", whatsappNumber: "" };
  }
};

export const updateSettings = async (settingsData) => {
  try {
    await setDoc(settingsDoc, settingsData, { merge: true });
    return result(true);
  } catch (error) {
    console.error("Error updating settings: ", error);
    return result(false, null, error.message);
  }
};

export const subscribeSettings = (callback) => {
  return onSnapshot(settingsDoc, (snapshot) => {
    if (snapshot.exists()) {
      callback(snapshot.data());
    } else {
      callback({ shopName: "Riders Gear Nairobi", whatsappNumber: "" });
    }
  }, (error) => {
    console.error("Error subscribing to settings: ", error);
  });
};
