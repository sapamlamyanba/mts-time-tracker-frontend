import React, { useEffect } from 'react'
import { Navigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
import { setUser } from '../redux/features/userSlice'

export default function ProtectedRoute({ children }) {
  const dispatch = useDispatch()
  const { user } = useSelector(state => state.user)

  useEffect(() => {
  const getUser = async () => {
    try {
      
      const res = await axios.post('http://localhost:8000/api/user/getUserData',
        { token: localStorage.getItem('token') },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        })
     
      if (res.data.success) {
        dispatch(setUser(res.data.data))
      } else {
        <Navigate to='/' />
      }
    } catch (error) {
      console.log(error)
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

