
import "./listPage.scss";
import Filter from "../../../components/navbar/filter/Filter"
import Card from "../../../components/navbar/card/Card"
import Map from "../../../components/navbar/map/Map";
import { useLoaderData } from "react-router-dom";

function ListPage() {
  // const data = listData;
  const posts=useLoaderData();
  // console.log(posts)
  
  return <div className="listPage">
    <div className="listContainer">
      <div className="wrapper">
        <Filter/>
        {posts.map(item=>(
          <Card key={item._id} item={item}/>
        ))}
      </div>
    </div>
    <div className="mapContainer">
      <Map key={posts._id} items={posts}/>
    </div>
  </div>
}

export default ListPage;