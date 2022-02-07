import { supabase } from './db.js';
import CryptoJS from 'crypto-js';

export async function getDecodedVideoURL(encodedString, courseAddress) {
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
        const decryptedURL = await CryptoJS.AES.decrypt(
          encodedString,
          data[0].hash
        ).toString(CryptoJS.enc.Utf8);
        resolve({
          success: true,
          data: decryptedURL.slice(1, decryptedURL.length - 1),
          err: null,
        });
      } else {
        reject({ success: false, data: null, err: error });
      }
    } catch (error) {
      console.log(error);
      reject({ success: false, data: null, err: error });
    }
  });
}
