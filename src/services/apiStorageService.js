const base_url = "http://localhost:9571";

const api = {
  // used for add data into api
  postData: async (data) => {
    try {
      const response = await fetch(`${base_url}/students`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      return await response.json(); // return the response if needed
    } catch (err) {
      console.error("Error in postData:", err);
    }
  },
  // used for get all data into api
  getData: async () =>
    {
    try {
      const response = await fetch(`${base_url}/students`)

      if(!response.ok)
      {
        console.error("HTTP Error : ",response.status);
        return null;
      }
      return await response.json(); 
    } catch(err)
    {
      console.error("Fetching error : ",err);
      return null;
    }
  }
    ,
  // used for edit data from api
  updateData: async (id, data) => {
    try
    {
      const response = await fetch(
        `${base_url}/students/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      )
      return await response.json();
    }
    catch(err)
    {
      console.log(err);
    }
  }
    ,
  // used for delete data from api
  deleteData: async (id) => {
    try {
      const response = await fetch(`${base_url}/students/${id}`, {
        method: "DELETE"
      });
  
      if (!response.ok) {
        throw new Error("Failed to delete student");
      }
  
      return await response.json();
    } catch (err) {
      console.error("Delete error:", err);
      throw err; // rethrow to handle in caller
    }
  }  
};

export default api;
