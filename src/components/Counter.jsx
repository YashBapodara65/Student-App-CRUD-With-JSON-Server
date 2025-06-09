import React, { useEffect, useState } from 'react';
import { Card, CardContent, Typography, Grid, Box, Skeleton, Stack } from '@mui/material';

const Counter = ({counters, records, loading}) => {

  // used for unique class with length
  const [totalClass, setClasses] = useState([]);

  // when our records variable change then useEffect call
  useEffect(()=>{
    if(records)
    {
      let classes = records.map((element)=>Number(element.class));
      classes = [...new Set(classes)]

      let totalClassLength = classes.map((item)=> {
        return {
          class : item,
          length : records.filter((ele)=> ele.class == item).length
        };
      })

      setClasses(totalClassLength)
    }
  },[records]);

  const skeleton_data = [
  {type : "rounded", width:310, height : 140},
  {type : "rounded", width:310, height : 140},
  {type : "rounded", width:310, height : 140},
  {type : "rounded", width:310, height : 140},
  ]

  return (
    <>
    {
      loading
      ?
          <div style={{display:"flex", justifyContent:"center", marginTop:"20px"}}>
            <Box sx={{ display: "flex", justifyContent: "center", width: "95%" }}>
       <Stack direction="row" spacing={5}>
         {skeleton_data.map((item, index) => (
           <Skeleton key={index} variant={item.type} width={item.width} height={item.height} />
         ))}
       </Stack>
     </Box>
          </div>
     :
        records.length > 0
        ?
            <div style={{display:"flex", justifyContent:"center"}}>
        <Box sx={{ p: 2 }} style={{width:"90%"}}>
    <Grid container spacing={5}>
      {counters?.map((counter) => (
        <div key={counter.name} style={{display:"flex"}}>
            <Card sx={{ textAlign: 'center', py: 2 }} style={{width:"300px"}}>
            <CardContent>
              <Typography variant="h6" color="text.secondary">
                {counter.name}
              </Typography>
              <Typography variant="h5" sx={{ mt: 1 }}>
                {counter.length}
              </Typography>
            </CardContent>
          </Card>
        </div>
      ))}
      {totalClass?.map((counter,index) => (
        <div key={index} style={{display:"flex"}}>
            <Card sx={{ textAlign: 'center', py: 2 }} style={{width:"300px"}}>
            <CardContent>
              <Typography variant="h6" color="text.secondary">
                {counter.class} class
              </Typography>
              <Typography variant="h5" sx={{ mt: 1 }}>
                {counter.length}
              </Typography>
            </CardContent>
          </Card>
        </div>
      ))}
    </Grid>
  </Box>
    </div>
    :
    "Not records available"
    }
    </>
  )
}

export default Counter
