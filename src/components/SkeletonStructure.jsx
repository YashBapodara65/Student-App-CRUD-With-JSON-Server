import React from 'react'
import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';

const SkeletonStructure = ({skeleton_data}) => {
  return (
    <>
     <Stack spacing={1}>
      <div style={{width:"100%", display:"flex", gap:"40px"}}>
        {
          skeleton_data.map((item,index)=>{
            return (
              <Skeleton key={index} variant={item.type} width={item.width} height={item.height} />
            )
          })
        }
      </div>
    </Stack>
    </>
  )
} 

export default SkeletonStructure