import React from 'react'

export default function CreateListing() {
    const max_6 = "{max 6}";
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
                    <input className='p-3 border border-gray-300 rounded-w-full' type="file" id='images' accept='image/*' multiple />
                    <button className='p-3 text-green-700 border border-green-700 rounded uppercase hover:shadow-lg disabled:opacity-80'>Upload Images</button>
                </div>
                <button className='p-3 bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 disabled:opacity-80'>Create Listing</button>
            </div>

        </form>
    </main>
  )
}
