import { useState } from 'react'
import { getDownloadURL, ref,  getStorage, uploadBytesResumable } from 'firebase/storage'
import { app } from '../firebase'
export default function CreateListing() {
    const max_6 = "{max 6}";
    const [files, setFiles]= useState([]);

    const[formData, setFormData] = useState(
        {imageURLs: [],}
    );
    
    const [imageUploadError, setImageUploadError] =useState(false);
    const [uploading, setuploading] = useState(false);

    console.log(formData)
    
    const handleImageSubmit = (e) => {
        if(files.length>0 && files.length + formData.imageURLs.length<7) {
            setuploading(true)
            setImageUploadError(false)
            const promises = [];
            for (let i = 0; i < files.length; i++) {
                promises.push(uploadImage(files[i]));
            }
            Promise.all(promises).then((urls) => {
                setFormData({...formData, imageURLs: formData.imageURLs.concat(urls)});
                setImageUploadError(false);
                setuploading(false)
            }).catch((error) => {
                setImageUploadError("Image Upload Failed (10 MB max): ");
                setuploading(false)
            })
        } else {
            setImageUploadError("You can only upload up to 6 images.");
            setuploading(false)
        }
    }

    const uploadImage = async (file) => {
        return new Promise((resolve, reject) => {
            const storage = getStorage(app);
            const fileName = new Date().getTime() + file.name;
            const storageRef = ref(storage, fileName);
            const uploadTask = uploadBytesResumable(storageRef, file);
            
            // Listen for state changes on the upload task.
            uploadTask.on('state-changed', (snapshot) => {
                const progress= (snapshot.bytesTransferred / snapshot.totalBytes) *100;
                console.log(`Upload is ${progress}% done`)
            }, (error) => {
                reject(error);
            },
            ()=>{
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                    resolve(downloadURL);
                });
            })
        });
    }

    const handleRemoveImage = (index) => {
        setFormData({
            ...formData, 
            imageURLs: formData.imageURLs.filter((_, i)=> i!==index),
        })

        console.log('working')
    }
  return (
    <main className='p-3 max-w-4xl mx-auto'>
        <h1 className='text-3xl font-semibold text-center my-7'>Create a Listing</h1>

        <form className='flex flex-col sm:flex-row gap-4'>
            <div className='flex flex-col gap-4 flex-1'>
                <input type='text' className='border p-3 rounded-lg' id='name' maxLength='40' minLength='5' placeholder='Name' />
                <input type='text' className='border p-3 rounded-lg' id='Description' required placeholder='Description' />
                <input type='text' className='border p-3 rounded-lg' id='author' maxLength='40' required minLength='5' placeholder='Author' />

                <div className='flex gap-6 flex-wrap'>
                    <div className="flex gap-2">
                        <input type="checkbox" id='sale' className='w-5' />
                        <span>Sell</span>
                    </div>

                    <div className="flex gap-2">
                        <input type="checkbox" id='published' className='w-5' />
                        <span>Published</span>
                    </div>

                    <div className="flex gap-2">
                        <input type="checkbox" id='Offer' className='w-5' />
                        <span>Offer</span>
                    </div>
                </div>

                <div className='flex flex-wrap gap-4'>
                    <div className='flex items-center gap-2'>
                        <input type="number" id='No_books' min='1' max='10' required className='p-3 border border-gray-300 rounded-lg '/>
                        <p>Number of Books</p>
                    </div>

                    <div className='flex items-center gap-2'>
                        <input type="number" id='No_chapters' min='1' max='20' className='p-3 border border-gray-300 rounded-lg '/>
                        <p>Number of chapters</p>
                    </div>

                    <div className='flex items-center gap-2'>
                        <input type="number" id='No_pages' min='50' max='2000' className='p-3 border border-gray-300 rounded-lg '/>
                        <p>Number of Pages</p>
                    </div>

                    <div className='flex items-center gap-2'>
                        <input type="number" id='regularPrice' min='50' max='5000' className='p-3 border border-gray-300 rounded-lg '/>
                        <p>Regular Price</p>
                    </div>

                    <div className='flex items-center gap-2'>
                        <input type="number" id='discountedPrice' min='50' max='2000' className='p-3 border border-gray-300 rounded-lg '/>
                        <p>Discounted Price</p>
                    </div>
                </div>
            </div>

            <div className='flex flex-col flex-1 gap-4'>
                <p className='font-semibold'>Images:
                <span className='font-norma text-gray-600 ml-2'>The first image will be the cover {max_6} </span>
                </p>

                <div className='flex gap-4'>
                    const <input onChange={(e)=> setFiles(e.target.files)} className='p-3 border border-gray-300 rounded-w-full' type="file" id='images' accept='image/*' multiple />
                    <button type='button' onClick={handleImageSubmit} className='p-3 text-green-700 border border-green-700 rounded uppercase hover:shadow-lg disabled:opacity-80'>{uploading ? 'Uploading...' : 'Upload Images'}</button>
                </div>
                <p className='text-red-700 tx-sm'>{imageUploadError && imageUploadError}</p>
                {
                    formData.imageURLs.length > 0 && formData.imageURLs.map((url, index)=> (
                        <div key={index} className='flex justify-between item-center p-3 border'>
                            <img src={url} alt="listing image" className='w-20 h-20 object-contain rounded-lg'/>
                            <button disabled={uploading} type='button' onClick={() => handleRemoveImage(index)} className='p-3 text-red-700 rounded-lg uppercase hover:opacity-95 '>Delete</button>
                        </div>
                    ))
                }
                <button className='p-3 bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 disabled:opacity-80'>Create Listing</button>
            </div>


        </form>
    </main>
  )
}
