const api = {
  // used for add data into api
  postData: (data) =>
    fetch("http://localhost:9571/students", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((res) => res.json())
      .then((res) => {
        console.log("Add Success," + res);
      })
      .catch((err) => console.log(err)),
  // used for get all data into api
  getData: () =>
    fetch("http://localhost:9571/students")
      .then((res) => res.json())
      .then((res) => {
        return res;
      })
      .catch((err) => console.error(err)),
  // used for edit data from api
  updateData: (id, data) =>
    fetch(
      `http://localhost:9571/students/${id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }
    )
      .then((res) => res.json())
      .then((res) => {
        return res;
      })
      .catch((err) => console.error(err)),
  // used for delete data from api
  deleteData : (id) => fetch(`http://localhost:9571/students/${id}`,{
    method : "DELETE"
  })
  .then((res)=>res.json())
  .then((res)=>{
    console.log("Data delete successfully, "+res);
  })    
  .catch((err)=>console.error(err))
};

export default api;
