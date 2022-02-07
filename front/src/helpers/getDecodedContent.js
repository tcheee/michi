import { supabase } from './db.js';
import CryptoJS from 'crypto-js';

export async function getDecodedContent(encodedString, courseAddress) {
  return new Promise(async (resolve, reject) => {
    try {
      let { data, error } = await supabase
        .from('lesson_hash')
        .select(
          `
        hash, 
        course_address
        `
        )
        .eq('course_address', courseAddress.toLowerCase());
      if (data[0]) {
        const decrypt = CryptoJS.AES.decrypt(encodedString, data[0].hash);
        const decryptedURL = CryptoJS.enc.Utf8.stringify(decrypt);
        console.log('hereee');
        console.log(decryptedURL);
        resolve({
          success: true,
          data: decryptedURL,
          err: null,
        });
      } else {
        reject({ success: false, data: null, err: error });
      }
    } catch (error) {
      reject({ success: false, data: null, err: error });
    }
  });
}
