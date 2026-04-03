import React from 'react'
import '../App.css'
import { useState,useEffect } from 'react';
import profilepic from '../assets/profile.avif'
import Cropper from 'react-easy-crop';


const ProfilePage = () => {
  const [user, setuser] = useState(null);
  const [stats, setstats] = useState(null);
  const [name, setname] = useState(null);
  const [editopen, seteditopen] = useState(false);
  const [image, setimage] = useState(null);
  const [crop, setcrop] = useState({x:0,y:0});
  const [zoom, setzoom] = useState(1);
  const [croppedareapixel, setcroppedareapixel] = useState(null);
  const [showcrop, setshowcrop] = useState(false);
  const [loading, setloading] = useState(false);

  useEffect(() => {
    const fetchdata=async () => {
      const token=localStorage.getItem("token");
      const userres=await fetch("http://localhost:5000/api/profile/me",{
        headers:{Authorization:`Bearer ${token}`}
      });
      const statsres=await fetch("http://localhost:5000/api/profile/stats",{
        headers:{Authorization:`Bearer ${token}`}
      });
      const userdata=await userres.json();
      const statsdata=await statsres.json();
      setuser(userdata);
      setstats(statsdata);
    };
      fetchdata();
  }, [])
const onselectfile=(e)=>{
  const file=e.target.files[0];
  if(!file){
    return;
  }
  const reader=new FileReader();
  reader.onload=()=>{
    setimage(reader.result);
    setshowcrop(true);
  };
  reader.readAsDataURL(file);
}
const getcroppedimg=async (imagesrc,crop) => {
  const image=new Image();
  image.src=imagesrc;
  await new Promise((resolve)=>(image.onload=resolve));
  const canvas=document.createElement('canvas');
  const ctx=canvas.getContext("2d");
  canvas.width=crop.width;
  canvas.height=crop.height;
  ctx.drawImage(
    image,
    crop.x,
    crop.y,
    crop.width,
    crop.height,
    0,0,
    crop.width,
    crop.height
  );
  return new Promise((resolve)=>{
    canvas.toBlob((blob)=>{
      resolve(blob);
    },"image/jpeg");
  });
}
const handlecropupload=async () => {
  setloading(true);
  if(!croppedareapixel){
    alert("Please..")
  }
  const croppedBlob=await getcroppedimg(image,croppedareapixel);
  const formdata=new FormData();
  formdata.append("image",croppedBlob);
  const token=localStorage.getItem("token");
  const res=await fetch("http://localhost:5000/api/profile/upload-avatar",{
    method:"POST",
    headers:{
      Authorization:`Bearer ${token}`
    },
    body:formdata,
  })
  const data=await res.json();
  setuser(data);
  setshowcrop(false);
  setloading(false);
}
  const handleUpdate=async () => {
    const token=localStorage.getItem('token')
    const res=await fetch("http://localhost:5000/api/profile/update",{
      method:"PUT",
      headers:{
        "Content-Type":"application/json",
        Authorization:`Bearer ${token}`
      },
      body:JSON.stringify({name}),
    });
    const data=await res.json();
    setuser(data);
    seteditopen(false);
  }
  return (
    <div>
<div className="bg-white shadow-lg rounded-2xl p-6 flex items-center gap-4 relative bottom-[8vh] w-[80vw] justify-around">
  <div className="profile-char w-16 h-16 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white text-xl">
    {user?.name?.charAt(0)}
  </div>

  <div>
    <h2 className="profilename font-semibold">{user?.name}</h2>
    <p className=" profile-mail text-gray-500">{user?.email}</p>

    <span className="text-xs profile-role bg-blue-100 text-blue-600 px-2 py-1 rounded">
      {user?.role}
    </span>
  </div>
  <div
   className='w-[135px] h-[140px] profile rounded-[50%]'>
<img src={user?.avatar||profilepic} alt="profile"
className='w-full h-full object-cover rounded-[50%]'
/>
   </div>
   <label className='cursor-pointer bg-[#ffff] text-[#202430] px-[8px] py-[4px] rounded-[18px]'>
    Change Photo
   <input type="file" className='hidden' onChange={onselectfile}/>
  </label>
{showcrop && (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
    <div className="bg-white p-4 rounded-xl h-[300px] w-[400px]">
      <Cropper
        image={image}
        crop={crop}
        zoom={zoom}
        aspect={1} // square avatar
        onCropChange={setcrop}
        onZoomChange={setzoom}
        onCropComplete={(croppedarea, croppedPixels) =>
          setcroppedareapixel(croppedPixels)
        }
      />

      <button 
      onClick={handlecropupload}
       className="mt-4 relative top-[52vh] w-full bg-blue-600 text-[#ffff] py-2 rounded">
       {loading?"Uploading..":"Crop and Upload"}
      </button>
    </div>
  </div>
)}
</div>
<div className="stats w-[80vw] h-[26vh] flex justify-around">
  <div className=''>
    <p>Skills</p>
    <h2>{stats?.skills}</h2>
  </div>
  <div>
    <p>Applications</p>
    <h2>{stats?.application}</h2>
  </div>
  <div>
    <p>Resumes</p>
    <h2>3</h2>
  </div>
</div>
<button onClick={()=>seteditopen(true)} className='mt-6 white px-4 py-2 rounded-lg ml-[8px] ' >Edit Profile</button>
<div className='mt-6 text-white p-4 rounded-xl'>
🚀 You’ve added {stats?.skills} skills — keep growing!
</div>
{editopen && (
  <div
    className="fixed inset-0 backdrop-blur-sm bg-black/30 flex items-center justify-center z-50"
    onClick={() => seteditopen(false)} // click outside closes
  >
    <div
      className="bg-white rounded-2xl shadow-2xl p-6 w-[350px] bg-blur relative editprofile animate-[fadeIn_0.3s_ease]"
      onClick={(e) => e.stopPropagation()} // prevent closing when clicking inside
    >
      {/* Close Button */}
      <button
        onClick={() => seteditopen(false)}
        className=" editbtn absolute top-2 right-3 white text-gray-500 hover:text-black"
      >
        ✕
      </button>

      <h2 className="text-lg text-center font-semibold mb-4">Edit Profile</h2>

      <input
        type="text"
        value={name}
        onChange={(e) => setname(e.target.value)}
        placeholder="Enter new name"
        className=" editinput border p-2 w-full rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
      />

      <button
        onClick={handleUpdate}
        className="w-full bg-blue-600 white py-2 rounded-lg hover:bg-blue-700 transition"
      >
        Save Changes
      </button>
    </div>
  </div>
)}
    </div>
  )
}

export default ProfilePage