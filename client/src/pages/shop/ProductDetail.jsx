// Thuc
import { useParams } from "react-router-dom";
import { products } from "./GearShop";
import Button from "../../components/Button";

export default function ProductDetail() {
  const { id } = useParams();
  const product = products.find((p) => p.id === id);

  if (!product)
    return <div className="text-center mt-20">Product not found </div>;

  return (
    <div className="max-w-5xl mx-auto px-6 py-10 mt-10">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <div>
          <div className="w-full h-80 bg-gray-500 flex items-center justify-center rounded-md">
            <span className="text-gray-700 text-lg">
              Image: {product.image}
            </span>
          </div>
        </div>

        <div>
          <h1 className="text-3xl font-bold text-gray-700 mb-2">
            {product.name}
          </h1>
          <p className="text-gray-600 mb-4">{product.description}</p>
          <p className="text-2xl font-bold text-green-700 mb-6">
            ${product.price}
          </p>

          <ul className="list-disc list-inside text-sm text-gray-600 mb-4">
            {product.highlights.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>

          <div className="flex items-center gap-4">
            <input
              type="number"
              min="1"
              defaultValue="1"
              className="w-20 px-3 py-2 border border-gray-300 rounded-md text-center"
            />

            <Button>Add to Cart</Button>
          </div>
        </div>
      </div>

      <div className="mt-12">
        <h2 className="text-xl font-semibold mb-2">Product Details</h2>
        <p className="text-gray-600">{product.details}</p>
      </div>
    </div>
  );
}
