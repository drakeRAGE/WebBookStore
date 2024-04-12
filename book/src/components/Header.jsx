import { useEffect, useState } from 'react'
import {FaSearch} from 'react-icons/fa'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

export default function Header() {
    const {currentUser} = useSelector(state =>state.user);
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();  

    const handleSubmit = (e) =>{
        e.preventDefault();
        
        const urlParams = new URLSearchParams(window.location.search);
        urlParams.set('searchTerm', searchTerm);
        const searchQuery = urlParams.toString();
        navigate(`/search?${searchQuery}`);

    };

    useEffect(()=> {
        const urlParams = new URLSearchParams(window.location.search);
        const searchTerm = urlParams.get('searchTerm');
        if(searchTerm){
            setSearchTerm(searchTerm);
        }
    }, [location.search])
  return (
    <header className='bg-slate-200 shadow-md'>
        <div className='flex justify-between items-center max-w-6xl mx-auto p-3'>
            <Link to='/'>
                {/* Here I have added text-sm for mobile and text-xl for screen size greater than mobile*/}
                <h1 className='font-bold text-sm sm:text-xl flex flex-wrap'> 
                    <span className='text-slate-500'>Dragbos</span>
                    <span className='text-slate-700'>Store</span>
                </h1>
            </Link>
            <form onSubmit={handleSubmit} className='bg-slate-100 p-3 rounded-lg flex items-center'>
                <input onChange={(e)=> setSearchTerm(e.target.value)} value={searchTerm} type="text" placeholder='Search...' className='bg-transparent focus:outline-none w-24 sm:w-64'/>
                <button>
                    <FaSearch className='text-slate-600' />
                </button>
            </form>

            <ul className='flex gap-4'>
                <Link to='/'>
                    <li className='hidden sm:inline text-slate-700 hover:underline'>Home</li>
                </Link>
                <Link to='/about'>
                    <li className='hidden sm:inline text-slate-700 hover:underline'>About</li>
                    </Link>
                
                <Link to='profile'>
                    {currentUser ? (
                        <img className='rounded-full h-7 w-7 object-cover' src={currentUser.avatar} alt="profile" />
                    ): (
                    <li className='text-slate-700 hover:underline'>Sign-In</li>
                    )}
                </Link>
            </ul>
        </div>
    </header>
  )
}
