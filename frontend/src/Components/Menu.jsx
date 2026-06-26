import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { getMenus } from "../redux/actions/menuActions";
import Fooditem from "./Fooditem";
import "../modern-menu.css";

const Menu = () => {
  const { id } = useParams();
  const dispatch = useDispatch();

  const { menus, loading, error } = useSelector((state) => state.menus);

  useEffect(() => {
    dispatch(getMenus(id));
  }, [dispatch, id]);

  return (
    <div className="modern-menu-container">
      <div className="menu-header">
        <h1>Discover Our Menu</h1>
        <p>A symphony of flavors tailored for your palate</p>
      </div>

      <div className="container">
        {loading ? (
          <p className="text-center">Loading menus...</p>
        ) : error ? (
          <p className="text-center text-danger">Error: {error}</p>
        ) : Array.isArray(menus) && menus.length > 0 ? (
          menus.map((menu) => (
            <div key={menu.category} className="mb-5">
              <div className="text-center">
                <h2 className="category-title">{menu.category}</h2>
              </div>

              {Array.isArray(menu.items) && menu.items.length > 0 ? (
                <div className="row">
                  {menu.items.map((fooditem) => (
                    <Fooditem
                      key={fooditem._id}
                      fooditem={fooditem}
                      restaurant={id}
                    />
                  ))}
                </div>
              ) : (
                <p className="text-center">No items available in this category</p>
              )}
            </div>
          ))
        ) : (
          <p className="text-center">No menus available at the moment.</p>
        )}
      </div>
    </div>
  );
};

export default Menu;