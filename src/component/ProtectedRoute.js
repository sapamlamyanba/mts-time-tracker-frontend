import React, { useEffect } from 'react'
import { Navigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
import { setUser } from '../redux/features/userSlice'
import { BASE_URL } from '../config/ipconfig'

export default function ProtectedRoute({ children }) {
  const dispatch = useDispatch()
  const { user } = useSelector(state => state.user)

  useEffect(() => {
  const getUser = async () => {
    try {

      const token  = localStorage.getItem('token')
      // console.log('token',token)
      const res = await axios.post(`${BASE_URL}/user/getUserData`,
        { token: localStorage.getItem('token'),         
         },

        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        })
     
      if (res.data.success)
     {
      // console.log('Chekcingldkjfdslkjfdslj',res) 
        dispatch(setUser(res.data.data))

      } else {
        <Navigate to='/' />
      }
    } catch (error) {
      
    }
  } 
    if (!user) {
      getUser();
    }
  }, [user, dispatch])

  if (localStorage.getItem('token')) {
    return children
  } else {
    return <Navigate to='/' />
  }
}

