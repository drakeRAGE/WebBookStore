import {useState}  from 'react'
import {Link, useNavigate} from 'react-router-dom'
export default function SignIn() {
  const [formData, setFormData]= useState({});
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const handleChnage = (e) => {
    setFormData({
      ...formData,
      [e.target.id] : e.target.value,
    });
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // console.log('Form Submitted!');
      setLoading(true);
      const res = await fetch('/api/auth/signin',  {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },

        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if(data.success === false) {
        setLoading(false);
        setError(data.message);
        return;
      }
      setLoading(false);
      console.log(data);
      navigate('/');
    } catch(error) {
      setLoading(false);
      setError(error.message);
    }

  };

  // console.log(formData)
  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl text-center font-semibold my-7'>Sign In</h1>
      <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
        <input type="email" placeholder='email' className='border p-3 rounded-lg' id='email' onChange={handleChnage}/>
        <input type="password" placeholder='password' className='border p-3 rounded-lg' id='password' onChange={handleChnage}/>

        <button disabled={loading} className='bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-70'>{loading ? 'Loading...' : 'Sign In'}</button>
      </form>

      <div className='flex gap-2 mt-5'>
        <p>Dont have an account?</p>
        <Link to={'/sign-up'}>
          <span className='text-blue-700'>Sign Up</span>
        </Link>
      </div>

      {error && <p className='text-red-500 mt-5'>{error}</p>}
    </div>
  )
}
