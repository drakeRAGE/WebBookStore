import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';

export default function Contact({listing}) {
    const [authors, setauthors] = useState(null);
    const [message, setMessage] = useState('');

    const handleChange = (e) => {
        setMessage(e.target.value);
    }


    useEffect(()=> {
        const fetchauthors = async () => {
            try {
                const res = await fetch(`/api/user/${listing.userRef}`);
                const data = await res.json();
                setauthors(data);
            } catch (error) {
                console.log(error);
            }
        }
        fetchauthors();
    }, [listing.userRef]);
  return (
    <>
        {authors && (
            <div className='flex flex-col gap-2'>
                <p>Contact <span className='font-semibold'>{authors.username}</span> for <span className='font-semibold'>{listing.name.toLowerCase()}</span></p>
                <textarea className='w-full border p-3 rounded-lg' name="message" id="message" rows="2" value={message} onChange={handleChange} placeholder='Enter your message here!'></textarea>

                <Link className='bg-slate-700 text-white text-center p-3 uppercase rounded-lg hover:opacity-95' to={`mailto:${authors.email}?subject=Regarding ${listing.name}&body=${message}`}>Send Message</Link>
                
            </div>
        )}
    </>
  )
}
