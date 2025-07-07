import React, { useEffect, useState } from "react";
import { useOutletContext, Link } from "react-router-dom";
import "./EmailsList.css";

const OutOfStockProductsDB = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [, dark] = useOutletContext();

  useEffect(() => {
    const fetchOutOfStockProducts = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/products");
        if (!response.ok) throw new Error("Failed to fetch products");

        const allProducts = await response.json();
        const outOfStock = allProducts.filter(p => p.rating?.count === 0);
        setProducts(outOfStock);
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setTimeout(() => setLoading(false), 900); // simulate delay
      }
    };

    fetchOutOfStockProducts();
  }, []);

  return (
    <div className={`emails-list-container ${dark ? "dark" : ""}`}>
      {loading ? (
        <div className="admin"><h1>Loading Out of Stock Products...</h1></div>
      ) : products.length === 0 ? (
        <div className="admin"><h1>No Out of Stock Products Found</h1></div>
      ) : (
        <>
          <h2 className="emails-list-heading">Out of Stock Products (DB)</h2>
          <div className="emails-table-container">
            <table className="emails-table">
              <thead>
                <tr className="emails-table-header">
                  <th>Sr No.</th>
                  <th>Product ID</th>
                  <th>Title</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product, index) => (
                  <tr key={product.id} className="emails-table-row">
                    <td>{index + 1}</td>
                    <td>
                      <Link to={`/${product.id}`} className="heading">{product.id}</Link>
                    </td>
                    <td>
                      <Link to={`/${product.id}`} className="heading">{product.title}</Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
};

export default OutOfStockProductsDB;
