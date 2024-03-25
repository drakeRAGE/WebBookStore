import { useRef, useState, useEffect} from 'react';
import { useSelector } from 'react-redux'
import {getDownloadURL, getStorage, ref, uploadBytesResumable} from 'firebase/storage'
import { app } from '../firebase';

export default function Profile() {
  const fielRef = useRef(null);
  const {currentUser} = useSelector((state) =>state.user);
  const [file, setFile] = useState(undefined);
  const [filePercentage, setFIlePercentage] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [formData, setFormData] = useState({});
  // console.log(filePercentage);
  // console.log(file);
  // console.log(fileUploadError);
  // console.log(formData);

  useEffect (()=> {
    if(file) {
      handleFileUpload(file);
    }
  }, [file])

  const handleFileUpload = () => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, fileName)
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on('state_changed', 
      (snapshot) => {
        const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
        // console.log('Upload is'+ progress + '% done');
        setFIlePercentage(progress)
    },
    (error) => {
      setFileUploadError(true);
    },
    ()=> {
      getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
        setFormData({...formData, avatar: downloadURL})
      })
    }
    );
    
  }
  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl font-semibold text-center my-7 '>Profile</h1>
      <form className='flex flex-col gap-4'>
        <input onChange={(e)=>setFile(e.target.files[0])} type="file" ref={fielRef} hidden accept='image/*'/>
        <img onClick={()=>fielRef.current.click()} src={formData.avatar || currentUser.avatar}  alt="profile" className='rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-2'/>

        <p className='text-sm self-center'>
          {fileUploadError ? (
          <span className = 'text-red-700'>Error Image Upload (Image must be less than 2mb) </span> 
          ) : filePercentage > 0 && filePercentage <100 ? (
          <span className='text-slate-700'>{`Uploading ${filePercentage}%`}</span>
          ) : filePercentage===100 ? (
            <span className='text-green-700'>Successfully uploaded</span>
          ) : ( 
            ''
          )
          }
       </p>

        <input type="text" placeholder='username' className='border p-3 rounded-lg' id='username'/>
        <input type="email" placeholder='email' className='border p-3 rounded-lg' id='email' />
        <input type="password" placeholder='password' className='border p-3 rounded-lg' id='password' />

        <button className='bg-slate-700 text-white rounded-lg p-3 uppercase hover:opacity-95 disabled-80'>Update</button>
      </form>    

      <div className='flex justify-between mt-5'>
        <span className='text-red-700 cursor-pointer'>Delete Account</span>
        <span className='text-red-700 cursor-pointer'>Sign Out</span>
      </div>
    </div>
  )
}
