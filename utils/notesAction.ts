import { child, get, onChildAdded, push, ref, remove, serverTimestamp, set } from "firebase/database";
import { database } from "./firebase";

export const getNotesOnceFB = (path: string) => {
  get(child(ref(database), path)).then((snapshot) => {
    return snapshot.val();
  });
};

export const onNoteAdded = (path: string, callback: any) => {
  const commentsRef = ref(database, path);
  onChildAdded(commentsRef, (snapshot) => {
    callback(snapshot.val());
  });
}

interface notesData {
  id: string;
  action: string;
  timestamp?: any;
}

export const createNoteFB = (path: string, data: notesData) => {
  /*
    path = eventgeniStage/accountId/notes/coordinate/enquiryId/commentId
  */
  data.timestamp = serverTimestamp();
  set(push(ref(database, path)), data);
};

export const deleteNoteFB = (path: string) => {
  remove(child(ref(database), path));
};
