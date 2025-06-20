import {RouterProvider, createBrowserRouter} from "react-router-dom"
import Home from "./pages/Home"
import Form from "./pages/Form"
import Layout from "./routes/Layout"
function App() {

  const createBrowserRoute = createBrowserRouter([
  {
    path : "",
    element : <Layout/>,
    children : [
      {
        path : "/",
        element : <Home/>
      },
      {
        path : "/form",
        element : <Form/>
      },
      {
        path : "/edit-student-form/:id",
        element : <Form/>
      }
    ]
  },
  {
    // 
  }
])

  return (
    <RouterProvider router={createBrowserRoute} />
  )
}

export default App
