import { useState, useEffect} from 'react'
import { getDownloadURL, ref,  getStorage, uploadBytesResumable } from 'firebase/storage'
import { app } from '../firebase'
import {useSelector} from 'react-redux'
import { useNavigate, useParams} from 'react-router-dom';
export default function CreateListing() {
    const max_6 = "{max 6}";
    const {currentUser} = useSelector(state => state.user);
    const navigate = useNavigate();
    const [files, setFiles]= useState([]);
    const params = useParams();
    
    const[formData, setFormData] = useState({
        imageUrls: [],
        name: '',
        description: '',
        regularPrice: 50,
        discountPrice: 50,
        type: 'all',
        offer: false,
        author: '',
        published: true,
        BooksQuantity : 1,
        Pages: 50,
        Chapters: 1,
    });
    
    const [imageUploadError, setImageUploadError] =useState(false);
    const [uploading, setuploading] = useState(false);
    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(false);

    // console.log(formData)

    useEffect( () => {
        const fetchListing = async ()=> {
            const listingId = params.listingId;
            
            const res = await fetch(`/api/listing/get/${listingId}`);
            const data = await res.json();

            if(data.success === false) {
                console.log(data.message)
                return;
            }
            setFormData(data)

        }

        fetchListing();
    }, []);

    
    const handleImageSubmit = (e) => {
        if(files.length>0 && files.length + formData.imageUrls.length<7) {
            setuploading(true)
            setImageUploadError(false)
            const promises = [];
            for (let i = 0; i < files.length; i++) {
                promises.push(uploadImage(files[i]));
            }
            Promise.all(promises).then((urls) => {
                setFormData({...formData, imageUrls: formData.imageUrls.concat(urls)});
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
            imageUrls: formData.imageUrls.filter((_, i)=> i!==index),
        })

        console.log('working')
    }

    const handleChange = (e) => {
        if(e.target.id ==='sale' || e.target.id ==='rent') {
            setFormData({
                ...formData,
                type: e.target.id,
            })
        }

        if(e.target.id === 'published' || e.target.id === 'offer') {
            setFormData({
                ...formData,
                [e.target.id]: e.target.checked,
            })
        } 

        if(e.target.type === 'number' || e.target.type === 'text' || e.target.type === 'textarea') {
            setFormData({
                ...formData,
                [e.target.id]: e.target.value,
            })
        }

    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
        if (formData.imageUrls.length < 1)
            return setError('You must upload at least one image');
        if (+formData.regularPrice < +formData.discountPrice)
            return setError('Discount price must be lower than regular price');
        setLoading(true);
        setError(false);
        const res = await fetch(`/api/listing/update/${params.listingId}`, {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            },
            body: JSON.stringify({
            ...formData,
            userRef: currentUser._id,
            }),
        });
        const data = await res.json();
        setLoading(false);
        if (data.success === false) {
            setError(data.message);
        }
        navigate(`/listing/${data._id}`);
        } catch (error) {
        setError(error.message);
        setLoading(false);
    }
  };
  return (
    <main className='p-3 max-w-4xl mx-auto'>
        <h1 className='text-3xl font-semibold text-center my-7'>Update a Listing</h1>

        <form onSubmit={handleSubmit} className='flex flex-col sm:flex-row gap-4'>
            <div className='flex flex-col gap-4 flex-1'>
                <input onChange={handleChange} value={formData.name} type='text' className='border p-3 rounded-lg' id='name' maxLength='40' minLength='5' placeholder='Name' />
                <input onChange={handleChange} value={formData.description} type='text' className='border p-3 rounded-lg' id='description' required placeholder='Description' />
                <input onChange={handleChange} value={formData.author} type='text' className='border p-3 rounded-lg' id='author' maxLength='40' required minLength='5' placeholder='Author' />

                <div className='flex gap-6 flex-wrap'>
                    <div className="flex gap-2">
                        <input type="checkbox" id='sale' className='w-5' onChange={handleChange} checked={formData.type ==='sale'}/>
                        <span>Sell</span>
                    </div>

                    <div className="flex gap-2">
                        <input type="checkbox" id='rent' className='w-5' onChange={handleChange} checked={formData.type ==='rent'}/>
                        <span>Rent</span>
                    </div>

                    <div className="flex gap-2">
                        <input type="checkbox" id='published' className='w-5'  onChange={handleChange} checked={formData.published}/>
                        <span>Published</span>
                    </div>

                    <div className="flex gap-2">
                        <input type="checkbox" id='offer' className='w-5'  onChange={handleChange} checked={formData.offer}/>
                        <span>Offer</span>
                    </div>
                </div>

                <div className='flex flex-wrap gap-4'>
                    <div className='flex items-center gap-2'>
                        <input type="number" id='BooksQuantity' min='1' max='10' required className='p-3 border border-gray-300 rounded-lg '  onChange={handleChange} value={formData.BooksQuantity}/>
                        <p>Number of Books</p>
                    </div>

                    <div className='flex items-center gap-2'>
                        <input type="number" id='Chapters' min='1' max='20' className='p-3 border border-gray-300 rounded-lg '  onChange={handleChange} value={formData.Chapters}/>
                        <p>Number of chapters</p>
                    </div>

                    <div className='flex items-center gap-2'>
                        <input type="number" id='Pages' min='50' max='2000' className='p-3 border border-gray-300 rounded-lg '  onChange={handleChange} value={formData.Pages}/>
                        <p>Number of Pages</p>
                    </div>

                    <div className='flex items-center gap-2'>
                        <input type="number" id='regularPrice' min='50' max='50000' required className='p-3 border border-gray-300 rounded-lg '  onChange={handleChange} value={formData.regularPrice}/>
                        <p>Regular Price</p>
                    </div>

                    {formData.offer && 
                        (<div className='flex items-center gap-2'>
                            <input type="number" id='discountPrice' min='0' max='20000' className='p-3 border border-gray-300 rounded-lg '  onChange={handleChange} value={formData.discountPrice}/>
                            <p>Discount Price</p>
                        </div>)
                    }
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
                    formData.imageUrls.length > 0 && formData.imageUrls.map((url, index)=> (
                        <div key={index} className='flex justify-between item-center p-3 border'>
                            <img src={url} alt="listing image" className='w-20 h-20 object-contain rounded-lg'/>
                            <button disabled={uploading} type='button' onClick={() => handleRemoveImage(index)} className='p-3 text-red-700 rounded-lg uppercase hover:opacity-95 '>Delete</button>
                        </div>
                    ))
                }
                <button disabled={loading || uploading} className='p-3 bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 disabled:opacity-80'>{loading ? 'Creating...' : 'Update Listing'}</button>

                {error && <p className='text-red-700 text-sm'>{error}</p> }
            </div>


        </form>
    </main>
  )
}
