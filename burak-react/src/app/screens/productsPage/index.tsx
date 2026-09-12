import { Routes, Route } from "react-router-dom";
import { Products } from "./Products";
import { ChosenProduct } from "./ChosenProduct";

export function ProductsPage() {
  return (
    <Routes>
      <Route path="/" element={<Products />} />
      <Route path="/:productId" element={<ChosenProduct />} />
    </Routes>
  );
}
