import HomePage from "./pages/homepage/Homepage"
import { Layout, RequireAuth} from "./pages/homepage/layout/layout"
import ListPage from "./pages/homepage/listPage/ListPage"
import Login from "./pages/homepage/login/Login"
import SinglePage from "./pages/homepage/singlePage/SinglePage"
import ProfilePage from "./pages/homepage/profilePage/profilePage"
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import Register from "./pages/homepage/register/Register"
import ProfileUpdatePage from "./pages/homepage/profileUpdatePage/ProfileUpdatePage"
import { listPageLoader, profilePageLoader, singlePageLoader } from "./lib/loader"
import NewPostPage from "./pages/homepage/newPostPage/NewPostPage"

function App() {
  const router = createBrowserRouter([
      {
      path: "/",
      element: <Layout />,
      children:[
        {
          path:"/",
          element:<HomePage/>
        },
        {
          path:"/list",
          element:<ListPage/>,
          loader:listPageLoader
        },
        {
          path:"/:id",
          element:<SinglePage/>,
          loader:singlePageLoader
        },
        {
          path:"/login",
          element:<Login/>
        },
        {
          path:"/register",
          element:<Register/>
        },
      ]
    },
     {
      path: "/",
      element: <RequireAuth />,
      children: [
        {
          path: "/profile",
          element: <ProfilePage />,
          loader: profilePageLoader
        },
        {
          path: "/profile/update",
          element: <ProfileUpdatePage />,
        },
        {
          path: "/add",
          element: <NewPostPage/>,
        },
      ],
    },
  ]);

  return (

    <RouterProvider router={router}/>
  );
}

export default App;