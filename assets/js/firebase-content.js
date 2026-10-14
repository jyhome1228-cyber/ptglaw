import {db} from './firebase-client.js';
import {collection,getDocs,query,where,doc,getDoc} from 'https://www.gstatic.com/firebasejs/13.0.0/firebase-firestore.js';
// Public queries always constrain status, as required by Firestore Security Rules.
// Failure returns null so legacy GitHub JSON remains available.
export async function publicEntries(kind){
 try{const snap=await getDocs(query(collection(db,kind),where('status','==','published')));return snap.docs.map(d=>({id:d.id,...d.data()}));}
 catch(err){console.warn('Firestore public content unavailable:',err.code||err.message);return null;}
}
export async function publicEntry(kind,id){
 try{const snapshot=await getDoc(doc(db,kind,id));if(!snapshot.exists())return null;const value=snapshot.data();return value.status==='published'?{id:snapshot.id,...value}:null}
 catch(err){console.warn('Firestore detail unavailable:',err.code||err.message);return null;}
}
