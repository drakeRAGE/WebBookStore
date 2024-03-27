import { useRef, useState, useEffect} from 'react';
import { useSelector, useDispatch } from 'react-redux'
import {getDownloadURL, getStorage, ref, uploadBytesResumable} from 'firebase/storage'
import { app } from '../firebase';
import {updateUserFailure, updateUserStart, updateUserSuccess, deleteUserFailure, deleteUserStart, deleteUserSuccess, signoutUserStart, signInFailure, signoutUserSuccess } from '../redux/user/userSlice'

export default function Profile() {
  const fielRef = useRef(null);
  const {currentUser, loading, error} = useSelector((state) =>state.user);
  const [file, setFile] = useState(undefined);
  const [filePercentage, setFIlePercentage] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [formData, setFormData] = useState({});
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const dispatch = useDispatch();
  
  // console.log(filePercentage);
  // console.log(file);
  // console.log(fileUploadError);
  // console.log(formData);

  useEffect(() => {
    if (file) {
      handleFileUpload(file);
    }
  }, [file]);

  const handleFileUpload = () => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, fileName)
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on('state_changed', 
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        // console.log('Upload is'+ progress + '% done');
        setFIlePercentage(Math.round(progress));
    },
    (_error) => {
      setFileUploadError(true);
    },
    ()=> {
      getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => 
        setFormData({...formData, avatar: downloadURL})
      );
    }
    );
    
  }

  const handleChange = (e) => {
    setFormData({...formData, [e.target.id]: e.target.value});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(updateUserStart());
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(updateUserFailure(data.message));
        return;
      }

      dispatch(updateUserSuccess(data));
      setUpdateSuccess(true);
    } catch (error) {
      dispatch(updateUserFailure(error.message));
    }
  };

  const handleDeleteUser = async ()=> {
    try{
      dispatch(deleteUserStart());
      const res = await fetch(`/api/user/delete/${currentUser._id}`,  {
        method: 'DELETE',
      });
      const data= await res.json();
      if(data.success === false) {
        dispatch(deleteUserFailure(data.message));
        return;
      }
      dispatch(deleteUserSuccess(data));
    }catch(error) {
      dispatch(deleteUserFailure(error.message));
    }
  }

  const handleSignOut = async () => {
    try {
      dispatch(signoutUserStart());
      const res= await fetch('/api/auth/signout');
      const data = await res.json();

      if(data.success === false) {
        dispatch(signInFailure(data.message));
        return;
      }

      dispatch(signoutUserSuccess(data));
    } catch (error) {
      dispatch(signInFailure(error.message));
    }
  }

  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl font-semibold text-center my-7 '>Profile</h1>
      <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
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

        <input type="text" placeholder='username' className='border p-3 rounded-lg' defaultValue={currentUser.username} onChange={handleChange}  id='username'/>
        <input type="email" placeholder='email' className='border p-3 rounded-lg' defaultValue={currentUser.email} onChange={handleChange} id='email' />
        <input type="password" placeholder='password' className='border p-3 rounded-lg' onChange={handleChange} id='password' />

        <button disabled={loading} className='bg-slate-700 text-white rounded-lg p-3 uppercase hover:opacity-95 disabled-80'>{loading ? 'Loading...' : 'Update' }</button>
      </form>    

      <div className='flex justify-between mt-5'>
        <span onClick={handleDeleteUser} className='text-red-700 cursor-pointer'>Delete Account</span>
        <span onClick={handleSignOut} className='text-red-700 cursor-pointer'>Sign Out</span>
      </div>

      <p className='text-red-700 mt-5'>{error ? error : ''}</p>
      <p className='text-green-700 text-lg mt-5'>{updateSuccess ? 'User is updated successfully!' : ''}</p>
    </div>
  )
}
