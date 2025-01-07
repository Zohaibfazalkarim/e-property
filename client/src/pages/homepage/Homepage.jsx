

import SearchBar from "../../components/navbar/searchBar/Searchbar";
import "./homepage.scss";


function HomePage() {
  return (
    <div className="homePage">
      <div className="textContainer">
        <div className="wrapper">
          <h1 className="title">Find Real Estate & Get Your Dream Place</h1>
          <p>
            Discover the perfect place to call home with our extensive real estate listings. Whether you are searching for a cozy apartment in the heart of the city or a serene retreat in the countryside, we are here to guide you every step of the way. With years of expertise and a passion for excellence, we connect dreamers with dream homes, ensuring every property matches your lifestyle and aspirations. Let us turn your vision into reality and help you find a space where memories are made and futures are built.
        </p>

          <SearchBar/>
          <div className="boxes">
            <div className="box">
              <h1>16+</h1>
              <h2>Years of Experience</h2>
            </div>
            <div className="box">
              <h1>200</h1>
              <h2>Award Gained</h2>
            </div>
            <div className="box">
              <h1>2000+</h1>
              <h2>Property Ready</h2>
            </div>
          </div>
        </div>
      </div>
      <div className="imgContainer">
        <img src="/bg.png" alt="" />
      </div>
    </div>
  );
}

export default HomePage;