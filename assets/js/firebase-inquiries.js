import {db} from './firebase-client.js';
import {collection,addDoc,serverTimestamp} from 'https://www.gstatic.com/firebasejs/13.0.0/firebase-firestore.js';
/* No private case documents, uploads, or sensitive identifiers in inquiries. */
export async function submitInquiry(entry){
  const payload={
    type:entry.type==='quick'?'quick':'general',
    name:String(entry.name||'').trim().slice(0,100),
    phone:String(entry.phone||'').trim().slice(0,40),
    email:String(entry.email||'').trim().slice(0,150),
    message:String(entry.message||'').trim().slice(0,3000),
    category:String(entry.category||'').trim().slice(0,100),
    details:String(entry.details||'').trim().slice(0,4000),
    consent:true,
    createdAt:serverTimestamp(),
    status:'new'
  };
  if(!entry.consent)throw Error('개인정보 수집 동의가 필요합니다.');
  if(payload.phone.length<7||payload.message.length<2)throw Error('연락처와 문의 내용을 확인해주세요.');
  const ref=await addDoc(collection(db,'inquiries'),payload);
  return ref.id;
}
